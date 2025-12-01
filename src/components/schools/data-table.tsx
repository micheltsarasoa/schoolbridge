'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';

import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { SchoolDataTableToolbar } from './data-table-toolbar';
import { UpsertSchoolSheet } from './upsert-school-sheet';
import { Button } from '../ui/button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSuccess: () => void;
}

export function SchoolDataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  onSuccess,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedSchool, setSelectedSchool] = React.useState<TData | undefined>(undefined);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleAddSchool = () => {
    setSelectedSchool(undefined);
    setIsSheetOpen(true);
  };

  const handleEditSchool = (school: TData) => {
    setSelectedSchool(school);
    setIsSheetOpen(true);
  }

  const handleDeleteSchool = async (schoolId: string) => {
    if (!window.confirm('Are you sure you want to delete this school?')) return;

    try {
        const response = await fetch(`/api/schools/${schoolId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete school.');
        }
        onSuccess(); // Re-fetch data
    } catch (error) {
        console.error(error);
        // Here you might want to show an error toast
    }
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  // We need to enhance the columns to add edit functionality
  const enhancedColumns = React.useMemo(() => {
    const actionsColumn = columns.find(c => c.id === 'actions');
    if (actionsColumn) {
        // @ts-ignore
        actionsColumn.cell = ({ row }) => {
            const school = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditSchool(school)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteSchool(school.id)} className="text-red-500">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
    return columns;
  }, [columns]);

  return (
    <div className="space-y-4">
      <SchoolDataTableToolbar table={table} onAddSchool={handleAddSchool} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <UpsertSchoolSheet 
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        onSuccess={() => {
            onSuccess();
            handleCloseSheet();
        }}
        school={selectedSchool as any}
      />
    </div>
  );
}
