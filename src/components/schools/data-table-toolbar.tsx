'use client';

import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';

interface SchoolDataTableToolbarProps<TData> {
  table: Table<TData>;
  onAddSchool: () => void;
}

export function SchoolDataTableToolbar<TData>({
  table,
  onAddSchool,
}: SchoolDataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter schools by name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
        <Button onClick={onAddSchool} size="sm" className="h-8">
          <Plus className="mr-2 h-4 w-4" />
          Add School
        </Button>
      </div>
    </div>
  );
}
