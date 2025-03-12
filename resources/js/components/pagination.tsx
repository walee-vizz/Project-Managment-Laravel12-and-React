import { Link } from '@inertiajs/react';
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    Links: PaginationLink[] | null;
    queryParams?: Record<string, string | number>;
}
export default function Pagination({ Links, queryParams = {} }: PaginationProps) {
    if (!Links || Links.length === 0) return null; // Don't render if no pagination Links

    // Remove 'page' parameter from queryParams
    const filteredParams = queryParams ? Object.keys(queryParams)
        .filter((param) => param !== "page")
        .reduce<Record<string, string>>((acc, key) => {
            acc[key] = String(queryParams[key]);
            return acc;
        }, {}) : {};

    // Convert object to query string
    const urlParams = new URLSearchParams(filteredParams).toString();

    return (
        <nav aria-label="Page navigation" className="mt-4 text-center">
            <ul className="inline-flex h-10 -space-x-px text-base">
                {Links.map((link, index) => {
                    const urlWithParams = link.url
                        ? `${link.url}${link.url.includes('?') ? '&' : '?'}${urlParams}`
                        : null;

                    return (
                        <li key={index}>
                            <Link
                                preserveScroll
                                href={urlWithParams || "#"}
                                className={`inline-block py-2 px-3 rounded-lg text-xs
                                    ${link.active ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}
                                    ${!link.url ? "cursor-not-allowed text-gray-400 dark:text-gray-600" : "hover:bg-gray-300 dark:hover:bg-gray-800"}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                onClick={(e) => {
                                    if (!link.url || link.active) e.preventDefault(); // Prevent navigation for disabled links
                                }}
                            ></Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
