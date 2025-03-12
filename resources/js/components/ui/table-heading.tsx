import { forwardRef } from 'react';
import SortIcon from '@/components/ui/sort-icon';

const TableHeading = forwardRef(function TableHeading(
    { sortByField, currentField, sortDir, sortable = true, className = '', children, ...props }:
        { sortByField?: string, currentField?: string, sortDir?: string, sortable: boolean, className?: string, children?: React.ReactNode },
    ref: React.Ref<HTMLTableCellElement>
) {
    return (

        <th ref={ref} {...props} className={`px-6 py-3 ${sortable && 'cursor-pointer'} ` + className} scope="col">
            <div className="flex items-center">
                {children}
                {sortable && (
                    <SortIcon className='' sortByField={sortByField} currentField={currentField} sortDir={sortDir} />
                )}

            </div>
        </th >
    );
});

export default TableHeading;
