import { LucideIcon, BookOpen, Folder, LayoutGrid  } from 'lucide-react';
import { MultiValue, SingleValue, PropsValue, Props as SelectProps } from 'react-select';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type UserForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    [key: string]: unknown; // This allows for additional properties...

};


export type TaskForm = {
    name: string;
    image: string;
    description: string;
    due_date: string;
    status: string;
    priority: string;
    assigned_user_id: number;
    project_id: number;
    [key: string]: unknown; // This allows for additional properties...

};

export interface SelectInputOption {
    value: string;
    label: string | number;
    [key: string]: unknown; // This allows for additional properties...

}

export interface SelectInputProps extends Partial<SelectProps<SelectInputOption>> {
    className?: string;
    options: SelectInputOption[];
    isMulti?: boolean;
    defaultValue?: PropsValue<SelectInputOption>;
    onChange?: (option: SingleValue<SelectInputOption> | MultiValue<SelectInputOption>) => void;
}


export interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    image_path: string;
    created_at: string;
    updated_at: string;
    due_date: string;
    tasks: Task[];
    [key: string]: unknown; // This allows for additional properties...

};

export interface Task {
    id: number;
    name: string;
    description: string;
    status: string;
    image_path: string;
    due_date: string;
    assigned_user_id:number;
    assigned_user:User;
    project_id: number;
    project: Project;
    priority: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...

};

export interface TaskResource {
    data: Task[];
    links: {
        next: string;
        previous: string;
        last: string;
        first: string;
    };
    meta: PaginationMetadata
}

export interface TaskTableProps {
    tasks: TaskResource;
    queryParams: Record<string, unknown>;
    showProject?: boolean;
};

export interface PaginationLink {
    url: string;
    label: string;
    active: boolean;
};
export interface PaginationMetadata {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    count: number;
    links: PaginationLink[]
}

export interface QueryParams {
    // sortBy: string;
    // sortDir: string;
    // search: string;
    [key: string]: unknown;
}


export const SIDEBAR_MENUS: NavItem[] = [
    {
        title: 'Dashboard',
        url: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Users List',
        url: route('users.index'),
        icon: LayoutGrid,
    },
    {
        title: 'Projects',
        url: route('projects.index'),
        icon: LayoutGrid,
    },
    {
        title: 'Tasks',
        url: route('tasks.index'),
        icon: LayoutGrid,
    }
];

export const SIDEBAR_FOOTER_MENUS: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];
