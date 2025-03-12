
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import TaskForm from '@/components/forms/task-form';

export default function CreateTask() {


    return (
        <AppLayout
        >
            <Head title="Tasks - Create" />
            <div className="flex items-center justify-between">

                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Task
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
                        <TaskForm />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
