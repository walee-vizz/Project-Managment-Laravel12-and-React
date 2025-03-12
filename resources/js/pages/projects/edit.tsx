
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SelectInput from '@/components/select-input';
import { PROJECT_STATUS_TEXT_MAP } from '@/constants';
import { SelectInputOption, Project } from '@/types';
import { MultiValue, SingleValue, } from 'react-select';

export default function UpdateProject({ project }: { project: Project }) {

    const { data, setData, post, errors, reset } = useForm({
        'name': project?.name,
        'image': '',
        'description': project?.description,
        'due_date': project?.due_date,
        'status': project?.status,
        '_method': 'PUT'
    });

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('submitted :', data);
        post(route('projects.update', project?.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                console.log('Errors recieved :', errors);
            },
        });
    }
    return (
        <AppLayout>
            <Head title="Projects - Update" />
            <div className="flex items-center justify-between">

                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Update Project
                </h2>
                <Link
                    href={route("projects.index")}
                    className="px-3 py-1 text-white transition-all rounded shadow bg-emerald-500 hover:bg-emerald-600"
                >
                    Back
                </Link>
            </div>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* Form */}
                        <form onSubmit={onSubmit} className='p-4 bg-white shadow sm:p-8 dark:bg-gray-800 sm:rounded-lg'  >

                            <div className='mt-3'>
                                <Label htmlFor="name" >Project Name</Label>
                                <Input id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className={"w-full mt-1 " + (errors.name ? 'border-red-500' : '')}
                                    // isFocused={true}
                                    placeholder='Enter name'
                                    onChange={e => setData('name', e.target.value)} />
                                <InputError message={errors.name} className='mt-2' />
                            </div>
                            <div className='mt-3'>
                                <Label htmlFor="image">Project Image</Label>
                                <Input id="image" type="file" name="image" className={"w-full mt-1 form-input " + (errors.image ? 'border-red-500' : '')}
                                    // onChange={(e) => setData('email', e.target.value)}
                                    onChange={e => setData('image', e.target.files[0])}
                                />
                                <InputError message={errors.image} className='mt-2' />

                            </div>
                            <div className='mt-3'>
                                <Label htmlFor="desc" >Project Description</Label>

                                <textarea id="project_description"
                                    name="description"
                                    value={data.description}
                                    placeholder='  Enter description'
                                    className={"block w-full border-input border-1 border-rounded mt-1 form" + (errors.description ? 'border-red-500' : '')}
                                    onChange={(e) => setData("description", e.target.value)}>
                                </textarea>

                                <InputError message={errors.description} className='mt-2' />

                                {/* <Input /> */}
                            </div>
                            <div className="mt-4">
                                <Label htmlFor="project_status" >Project Status</Label>


                                <SelectInput
                                    name="status"
                                    id="project_status"
                                    placeholder="Select Status"
                                    className={`block w-full mt-1 cursor-pointer ${errors.status ? 'border-red-500' : ''}`}
                                    options={Object.entries(PROJECT_STATUS_TEXT_MAP).map(([status, text]) => ({
                                        value: status,
                                        label: text
                                    }))}
                                    defaultValue={{
                                        value: data.status,
                                        label: PROJECT_STATUS_TEXT_MAP[data.status]
                                    }}
                                    onChange={(selectedOption: MultiValue<SelectInputOption> | SingleValue<SelectInputOption>) => setData("status", selectedOption ? (selectedOption as SelectInputOption).value : '')}
                                />
                                <InputError message={errors.status} className="mt-2" />
                            </div>
                            <div className='mt-3'>
                                <Label htmlFor="due_date" >Project Due Date</Label>
                                <Input id="due_date" type="date" name="due_date" value={data.due_date} className={"w-full mt-1 " + (errors.due_date ? 'border-red-500' : '')} onChange={e => setData('due_date', e.target.value)} />
                                <InputError message={errors.due_date} className='mt-2' />

                            </div>
                            <div className="mt-4 text-right">
                                <Link
                                    href={route("projects.index")}
                                    className="px-3 py-1 mr-2 text-gray-800 transition-all bg-gray-100 rounded shadow hover:bg-gray-200"
                                >
                                    Cancel
                                </Link>
                                <button type='submit' className="px-3 py-1 text-white transition-all rounded shadow bg-emerald-500 hover:bg-emerald-600">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
