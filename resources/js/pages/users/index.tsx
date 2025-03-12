
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface UserResponse {
    data: User[];
}

export default function UserIndex({ users }: { users: UserResponse }) {
    // const { auth } = usePage<SharedData>().props;
    // console.log(users);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Link href={route('users.create')} className='text-indigo-500 underline'>Create User</Link>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    <Table>
                        <TableCaption>A list of users.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead >Id</TableHead>
                                <TableHead >Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.data?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.created_at}</TableCell>
                                    <TableCell className="text-right"></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </div>
            </div>
        </AppLayout>
    );
}
