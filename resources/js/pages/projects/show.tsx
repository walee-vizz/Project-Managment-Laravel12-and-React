import React, { useState } from 'react';
import Modal from 'react-modal';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from "@inertiajs/react";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from '@/constants';
import { Project, TaskResource } from '@/types';
import TasksTable from '../tasks/tasks-table';
import TaskForm from '@/components/forms/task-form';

Modal.setAppElement('#app'); // Set the app element for accessibility

export default function Show({ project, queryParams, tasks }: { project: Project, queryParams: Record<string, string | number>, tasks: TaskResource }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        console.log("Opening modal");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        console.log("Closing modal");
        setIsModalOpen(false);
    };
    return (
        <AppLayout>
            <Head title={`Project - ${project.name}`} />
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Project - {project.name}
                </h2>
                <div>
                    <Link
                        href={route("projects.edit", project.id)}
                        className="px-3 py-1 mx-2 text-white transition-all rounded shadow bg-emerald-500 hover:bg-emerald-600"
                    >
                        Edit
                    </Link>
                    <Link
                        href={route("projects.index")}
                        className="px-3 py-1 mx-2 text-white transition-all rounded shadow bg-emerald-500 hover:bg-emerald-600"
                    >
                        Back
                    </Link>
                </div>
            </div>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div>
                            <img
                                src={project.image_path}
                                alt=""
                                className="object-cover w-full h-64"
                            />
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-2 gap-1 mt-2">
                                <div>
                                    <div>
                                        <label className="text-lg font-bold">Project ID</label>
                                        <p className="mt-1">{project.id}</p>
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-lg font-bold">Project Name</label>
                                        <p className="mt-1">{project.name}</p>
                                    </div>

                                    <div className="mt-4">
                                        <label className="text-lg font-bold">Project Status</label>
                                        <p className="mt-1">
                                            <span
                                                className={
                                                    "px-2 py-1 rounded text-white " +
                                                    PROJECT_STATUS_CLASS_MAP[project.status]
                                                }
                                            >
                                                {PROJECT_STATUS_TEXT_MAP[project.status]}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-lg font-bold">Created By</label>
                                        {/* <p className="mt-1">{project.created_by.name}</p> */}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <label className="text-lg font-bold">Due Date</label>
                                        <p className="mt-1">{project.due_date}</p>
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-lg font-bold">Create Date</label>
                                        <p className="mt-1">{project.created_at}</p>
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-lg font-bold">Updated By</label>
                                        {/* <p className="mt-1">{project.updated_by.name}</p> */}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-lg font-bold">Project Description</label>
                                <p className="mt-1">{project.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Project - Tasks
                        </h2>
                        <div>
                            <button
                                onClick={openModal}
                                className="px-3 py-1 mx-2 text-white transition-all rounded shadow bg-emerald-500 hover:bg-emerald-600"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <TasksTable tasks={tasks} queryParams={queryParams} showProject={false} />
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Create Task"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                        {/* <!-- Modal header --> */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Static modal
                            </h3>
                            <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <div className="p-4 md:p-5 space-y-4">
                            <TaskForm projectId={project.id} />
                        </div>
                        {/* <!-- Modal footer --> */}
                        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button data-modal-hide="static-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                            <button data-modal-hide="static-modal" onClick={closeModal} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
                        </div>
                    </div>
                </div>

            </Modal>
        </AppLayout>
    )
}
