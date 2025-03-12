import { useEffect, useState } from 'react';
import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SelectInput from '@/components/select-input';
import InputError from '@/components/input-error';
import { TASK_STATUS_TEXT_MAP, TASK_PRIORITY_TEXT_MAP } from '@/constants';
import { Project, SelectInputOption, Task, User } from '@/types';
import Loader from '../ui/loader';

interface TaskCreateProps {
    projectId?: number | string;
    task?: Task;
}

export default function TaskForm({ task, projectId }: TaskCreateProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, errors, reset } = useForm({
        name: task?.name || '',
        image: '',
        description: task?.description || '',
        due_date: task?.due_date || '',
        status: task?.status || '',
        priority: task?.priority || '',
        assigned_user_id: task?.assigned_user_id || '',
        project_id: projectId || (task?.project_id || ''),
    });

    // Fetch Users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        query: `
                        query {
                          users {
                            id
                            name
                          }
                        }
                      `
                    })
                });
                const json = await response.json();
                setUsers(json.data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);



    // Fetch Projects (Only if projectId is not provided)
    useEffect(() => {
        if (!projectId) {
            const fetchProjects = async () => {
                try {
                    const response = await fetch('/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            query: `
                            query {
                              projects {
                                id
                                name
                              }
                            }
                          `
                        })
                    });
                    const json = await response.json();
                    setProjects(json.data.projects);
                } catch (error) {
                    console.error('Error fetching projects:', error);
                }
            };
            fetchProjects();
        }
    }, [projectId]);

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        const routeName = task?.id ? route('tasks.update', task.id) : route('tasks.store');

        post(routeName, {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => console.log('Errors received:', errors),
            onFinish: () => setLoading(false),
        });
    };
    // Render loading state
    if (loading) {
        return <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 h-[100vh] flex items-center justify-center"> <Loader /></div>;
    }
    return (

        // <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <form onSubmit={onSubmit} className="p-4 bg-white shadow sm:p-8 dark:bg-gray-800 sm:rounded-lg">
                    {/* Project Selection (Only when projectId is not given) */}
                    {!projectId && projects.length > 0 && (
                        <div className="mt-4">
                            <Label htmlFor="project">Project</Label>
                            <SelectInput
                                name="project_id"
                                id="project"
                                className={`block w-full mt-1 cursor-pointer ${errors.project_id ? 'border-red-500' : ''}`}
                                placeholder="Select project"
                                options={projects.map((project) => ({ value: project.id, label: project.name }))}
                                onChange={(selectedOption: SelectInputOption) => setData('project_id', selectedOption ? selectedOption?.value : '')}
                            />
                            <InputError message={errors.project_id} className="mt-2" />
                        </div>
                    )}

                    {/* Task Name */}
                    <div className="mt-3">
                        <Label htmlFor="name">Task Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className={`w-full mt-1 ${errors.name ? 'border-red-500' : ''}`}
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Task Image */}
                    <div className="mt-3">
                        <Label htmlFor="image">Task Image</Label>
                        <Input id="image" type="file" name="image" className="w-full mt-1 form-input" onChange={(e) => setData('image', e.target.files[0])} />
                        <InputError message={errors.image} className="mt-2" />
                    </div>

                    {/* Task Description */}
                    <div className="mt-3">
                        <Label htmlFor="desc">Task Description</Label>
                        <textarea
                            id="task_description"
                            name="description"
                            className={`block w-full mt-1 ${errors.description ? 'border-red-500' : ''}`}
                            onChange={(e) => setData('description', e.target.value)}
                            value={data.description}
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    {/* Task Priority */}
                    <div className="mt-4">
                        <Label htmlFor="task_priority">Task Priority</Label>
                        <SelectInput
                            name="priority"
                            id="task_priority"
                            placeholder="Select Priority"
                            className={`block w-full mt-1 cursor-pointer ${errors.priority ? 'border-red-500' : ''}`}
                            options={Object.entries(TASK_PRIORITY_TEXT_MAP).map(([priority, text]) => ({
                                value: priority,
                                label: text,
                            }))}
                            onChange={(selectedOption: SelectInputOption) => setData('priority', selectedOption ? selectedOption.value : '')}
                        />
                        <InputError message={errors.priority} className="mt-2" />
                    </div>

                    {/* Assigned User */}
                    <div className="mt-4">
                        <Label htmlFor="assigned_user">Assigned User</Label>
                        <SelectInput
                            name="assigned_user_id"
                            id="assigned_user"
                            placeholder="Select User"
                            className={`block w-full mt-1 cursor-pointer ${errors.assigned_user_id ? 'border-red-500' : ''}`}
                            options={users.map((user) => ({ value: user.id, label: user.name }))}
                            onChange={(selectedOption: SelectInputOption) => setData('assigned_user_id', selectedOption ? selectedOption.value : '')}
                        />
                        <InputError message={errors.assigned_user_id} className="mt-2" />
                    </div>

                    {/* Task Status */}
                    <div className="mt-4">
                        <Label htmlFor="task_status">Task Status</Label>
                        <SelectInput
                            name="status"
                            id="task_status"
                            placeholder="Select Status"
                            className={`block w-full mt-1 cursor-pointer ${errors.status ? 'border-red-500' : ''}`}
                            options={Object.entries(TASK_STATUS_TEXT_MAP).map(([status, text]) => ({
                                value: status,
                                label: text,
                            }))}
                            onChange={(selectedOption: SelectInputOption) => setData('status', selectedOption ? selectedOption.value : '')}
                        />
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    {/* Task Deadline */}
                    <div className="mt-3">
                        <Label htmlFor="due_date">Task Deadline</Label>
                        <Input
                            id="due_date"
                            type="date"
                            name="due_date"
                            value={data.due_date}
                            className={`w-full mt-1 ${errors.due_date ? 'border-red-500' : ''}`}
                            onChange={(e) => setData('due_date', e.target.value)}
                        />
                        <InputError message={errors.due_date} className="mt-2" />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-4 text-right">
                        <button type="submit" className="px-3 py-1 text-white transition-all rounded shadow bg-emerald-500 hover:bg-emerald-600">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
        // </div>
    );
}
