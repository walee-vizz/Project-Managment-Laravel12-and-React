
import TaskForm from '@/components/forms/task-form';
import AppLayout from '@/layouts/app-layout';
import { Task } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Edit({ task }: { task: Task }) {

    return (
        <AppLayout>
            <Head title="Tasks - Edit" />
            <div className="flex items-center justify-between">

                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Task "{task.name}"
                </h2>
                <Link
                    href={route("tasks.index")}
                    className="px-3 py-1 text-white transition-all rounded shadow bg-emerald-500 hover:bg-emerald-600"
                >
                    Back
                </Link>
            </div>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* Form */}
                        <TaskForm projectId={task?.project_id} task={task} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
