'use client';

import * as React from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
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
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "../data-table/data-table-pagination";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";

const data: User[] = [
    {
      id: "m5gr84i9",
      name: "John Doe",
      email: "ken99@yahoo.com",
      role: "Student",
      school: "Lycee Andohalo",
      status: "active",
      lastLogin: "2023-01-23T10:00:00Z",
      createdAt: "2022-01-01T12:00:00Z",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3u1reuv4",
      name: "Jane Smith",
      email: "Abe45@gmail.com",
      role: "Teacher",
      school: "Lycee Gallieni",
      status: "active",
      lastLogin: "2023-01-24T11:00:00Z",
      createdAt: "2022-02-15T14:30:00Z",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "derv1ws0",
      name: "Bob Johnson",
      email: "Monserrat44@gmail.com",
      role: "Parent",
      school: "Lycee Ampefiloha",
      status: "inactive",
      lastLogin: "2022-12-01T09:00:00Z",
      createdAt: "2022-03-20T18:00:00Z",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5kma53ae",
      name: "Alice Williams",
      email: "Silas22@gmail.com",
      role: "Student",
      school: "Lycee Andohalo",
      status: "active",
      lastLogin: "2023-01-25T12:00:00Z",
      createdAt: "2022-04-10T10:00:00Z",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "bhqecj4p",
      name: "Charlie Brown",
      email: "carmella@hotmail.com",
      role: "Admin",
      school: "-",
      status: "active",
      lastLogin: "2023-01-26T14:00:00Z",
      createdAt: "2022-05-05T16:00:00Z",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];
  
  export type User = {
    id: string;
    name: string;
    email: string;
    role: "Student" | "Teacher" | "Parent" | "Admin" | "Staff";
    school: string;
    status: "active" | "inactive";
    lastLogin: string;
    createdAt: string;
    avatar: string;
  };

  export const roles = [
    { value: "Student", label: "Student" },
    { value: "Teacher", label: "Teacher" },
    { value: "Parent", label: "Parent" },
    { value: "Admin", label: "Admin" },
    { value: "Staff", label: "Staff" },
  ];
  
  export const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];
  
  
  export const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
          <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                  <AvatarImage src={row.original.avatar} alt={row.getValue("name")} />
                  <AvatarFallback>{(row.getValue("name") as string).charAt(0)}</AvatarFallback>
              </Avatar>
              <div>{row.getValue("name")}</div>
          </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => <Badge variant="outline">{row.getValue("role")}</Badge>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "school",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="School" />
        ),
        cell: ({ row }) => <div>{row.getValue("school")}</div>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <Badge variant={row.getValue("status") === "active" ? "default" : "secondary"}>{row.getValue("status")}</Badge>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => (
          <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
        ),
      },
      {
        accessorKey: "lastLogin",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Login" />
        ),
        cell: ({ row }) => (
            <div>{new Date(row.getValue("lastLogin")).toLocaleString()}</div>
        ),
      },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
  
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit user</DropdownMenuItem>
              <DropdownMenuItem>Delete user</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

export function UserTable() {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
    );
    const [sorting, setSorting] = React.useState<SortingState>([]);
  
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
  
    return (
      <div className="space-y-4">
        <DataTableToolbar table={table} />
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
                    data-state={row.getIsSelected() && "selected"}
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
      </div>
    );
  }
