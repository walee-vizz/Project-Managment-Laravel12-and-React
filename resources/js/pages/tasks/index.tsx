import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import TasksTable from './tasks-table';
import { PaginationMetadata, Task } from '@/types';
interface taskIndexProps {
    tasks: {
        data: Task[];
        links: {
            next: string;
            previous: string;
            last: string;
            first: string;
        };
        meta: PaginationMetadata
    };
    queryParams: Record<string, unknown>;
};
export default function Index({ tasks, queryParams }: taskIndexProps) {

    queryParams = queryParams || {};

    return (
        <AppLayout>
            <Head title="Tasks" />
            <div className="flex items-center justify-between">

                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tasks
                </h2>
                <Link
                    href={route("tasks.create")}
                    className="px-3 py-1 text-white transition-all rounded shadow bg-emerald-500 hover:bg-emerald-600"
                >
                    Add new
                </Link>
            </div>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <TasksTable tasks={tasks} queryParams={queryParams} />
                </div>
            </div>
        </AppLayout >
    );
}
