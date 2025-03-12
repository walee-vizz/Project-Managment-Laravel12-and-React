import Pagination from '@/components/pagination';
import SelectInput from '@/components/select-input';
import TableHeading from '@/components/ui/table-heading';
import { Input } from '@/components/ui/input';
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from '@/constants';
import { Link, router } from '@inertiajs/react';
import { Button } from '@headlessui/react';
import { SelectInputOption, TaskTableProps } from '@/types';
import { MultiValue, SingleValue, } from 'react-select';


interface KeyPressEvent extends React.KeyboardEvent<HTMLInputElement> {
    target: HTMLInputElement;
}



export default function TasksTable({ tasks, queryParams, showProject = true }: TaskTableProps) {
    const currentRoute = route().current();
    console.log('current route: ', currentRoute);
    queryParams = queryParams || {};
    const sortByField = String(queryParams.sortBy || 'created_at');
    const sortDir = String(queryParams.sortDir || 'DESC');

    const searchFieldChanged = async (name: string, value: string | number) => {
        if (name == 'submit' && value == 'submit') {
            router.get(route(currentRoute), queryParams);
            return;
        } else if (name == 'clear' && value == 'clear') {
            if (queryParams?.page && queryParams?.page != 0) {
                router.get(route(currentRoute), { page: queryParams.page });
                return;
            }
            queryParams = {};
            router.get(route(currentRoute));
            return;
        } else if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route(currentRoute, queryParams));
    };


    const onKeyPress = async (name: string, e: KeyPressEvent): Promise<void> => {
        if (e.key == 'Enter') {
            searchFieldChanged(name, e.target.value);
        }
    };

    const sortBy = async (name: string) => {

        if (name == queryParams.sortBy) {
            queryParams.sortDir = queryParams.sortDir == 'ASC' ? 'DESC' : 'ASC';
        } else {
            queryParams.sortBy = name;
            queryParams.sortDir = 'ASC';
        }

        router.get(route(currentRoute, queryParams));

    }


    const deleteTask = (id: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('tasks.destroy', id));
        }

    }

    return (

        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="flex flex-col items-center justify-between gap-4 p-6 mb-6 bg-white rounded-lg shadow-md sm:flex-row dark:bg-gray-800">
                {/* Search Field */}
                <div className="flex items-center w-full sm:w-auto">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <Input type="text" id="search" placeholder="Search ..."
                        defaultValue={queryParams.search}
                        className={"block w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:w-64 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"}
                        onBlur={(e: KeyPressEvent) => searchFieldChanged('search', e.target.value)}
                        onKeyPress={(e: KeyPressEvent) => onKeyPress('search', e)}

                    />
                </div>

                {/* Filter by Status */}
                <div className="flex items-center w-full sm:w-auto">
                    <label htmlFor="status" className="sr-only">Status</label>
                    <SelectInput
                        name="status"
                        id="status"
                        placeholder="Select Status"
                        className={`block w-full mt-1 cursor-pointer `}
                        defaultValue={{
                            value: queryParams.status,
                            label: String(TASK_STATUS_TEXT_MAP[queryParams?.status])
                        }}
                        options={Object.entries(TASK_STATUS_TEXT_MAP).map(([status, text]) => ({
                            value: status,
                            label: text
                        }))}
                        onChange={(selectedOption: MultiValue<SelectInputOption> | SingleValue<SelectInputOption>) => searchFieldChanged("status", selectedOption ? (selectedOption as SelectInputOption).value : '')}
                    />
                </div>

                {/* Filter by Date Range */}
                <div className="flex items-center w-full gap-4 sm:w-auto">
                    <div>
                        <label htmlFor="from-date" className="sr-only">Start Date</label>
                        <Input type="date" id="from-date"
                            defaultValue={queryParams.from_date}
                            // value={queryParams.from_date}
                            className={"block w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:w-64 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => searchFieldChanged('from_date', e.target.value)}
                            onKeyUp={(e: KeyPressEvent) => onKeyPress('from_date', e)}

                        />
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <div>
                        <label htmlFor="to-date" className="sr-only">To Date</label>
                        <Input type="date" id="to-date"
                            defaultValue={queryParams?.to_date}
                            className={"block w-full px-4 py-2 text-nowrap text-sm text-gray-900 border border-gray-300 rounded-lg sm:w-64 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => searchFieldChanged('to_date', e.target.value)}
                            onKeyUp={(e: KeyPressEvent) => onKeyPress('to_date', e)}

                        />
                    </div>
                </div>

                {/* Search Button */}
                <Button className={"px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800"}
                    onClick={() => searchFieldChanged('submit', 'submit')}>
                    Search
                </Button>
                {
                    queryParams?.search || queryParams?.from_date || queryParams?.to_date || queryParams?.status ?

                        <Button className={"px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"}
                            onClick={() => searchFieldChanged('clear', 'clear')}>
                            Clear Search
                        </Button>
                        : null
                }
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <TableHeading sortable={false}>
                                Sr. No
                            </TableHeading>

                            <TableHeading sortable={false} sortByField={sortByField} currentField="id" sortDir={sortDir} >
                                Image
                            </TableHeading>
                            <TableHeading onClick={() => sortBy('name')} sortByField={sortByField} currentField="name" sortDir={sortDir} >Name</TableHeading>
                            <TableHeading onClick={() => sortBy('status')} sortByField={sortByField} currentField="status" sortDir={sortDir} >Status</TableHeading>
                            {
                                showProject ? <TableHeading onClick={() => sortBy('project')} sortByField={sortByField} currentField="project" sortDir={sortDir} >Project Name</TableHeading> : null
                            }

                            <TableHeading sortable={false} >Priority</TableHeading>
                            <TableHeading sortable={false} >
                                Assigned To
                            </TableHeading>
                            <TableHeading onClick={() => sortBy('created_at')} sortByField={sortByField} currentField="created_at" sortDir={sortDir} >Created At</TableHeading>
                            <TableHeading sortable={false} sortByField={sortByField} currentField="created_by" sortDir={sortDir} >
                                Created By
                            </TableHeading>
                            <TableHeading sortable={false} className="text-right">
                                Actions
                            </TableHeading>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.data.map((task, index) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={task.id}>
                                <td className="px-6 py-4">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4">
                                    <img src={task.image_path} alt={task.name} className="w-20 h-20 rounded-half" />
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 hover:underline whitespace-nowrap dark:text-white">
                                    <Link href={route('tasks.show', task.id)} >
                                        {task.name}
                                    </Link>
                                </th>
                                <td className="px-6 py-4">

                                    <span className={'px-2 py-1 rounded text-gray-900 dark:text-white ' + TASK_STATUS_CLASS_MAP[task.status]}>{TASK_STATUS_TEXT_MAP[task.status]}</span>
                                </td>
                                {
                                    showProject ?
                                        <td className="px-6 py-4">
                                            {task.project.name}
                                        </td>
                                        : null
                                }
                                <td className="px-6 py-4">
                                    {task.priority}
                                </td>
                                <td className="px-6 py-4">
                                    {task.assigned_user.name}
                                </td>
                                <td className="px-6 py-4">
                                    {task.created_at}
                                </td>
                                <td className="px-6 py-4">
                                    {task.created_by?.name}
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={route('tasks.edit', { task: task.id })} className="mx-1 font-medium text-blue-600 dark:text-blue-500 hover:underline" >
                                        Edit
                                    </Link>
                                    <Link href='javascript:void()' onClick={() => deleteTask(task?.id)} className="mx-1 font-medium text-red-600 dark:text-red-500 hover:underline" >
                                        Delete
                                    </Link>
                                </td>
                            </tr>

                        ))}

                    </tbody>
                </table>
                <Pagination Links={tasks.meta.links} className="mx-auto" queryParams={queryParams} />
            </div>
        </div>
    )
}
