'use client';

import * as React from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Trash2 } from "lucide-react";
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
import EditUserModal from "./EditUserModal";
import UserDetailsDialog from "./UserDetailsDialog";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  schoolId?: string;
  lastLogin?: string;
  createdAt: string;
  classes?: Array<{ id: string; name: string }>;
};

export const roles = [
  { value: "ADMIN", label: "Admin" },
  { value: "EDUCATIONAL_MANAGER", label: "Educational Manager" },
  { value: "TEACHER", label: "Teacher" },
  { value: "STUDENT", label: "Student" },
  { value: "PARENT", label: "Parent" },
];

export const statuses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
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
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </Badge>
    ),
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
    cell: ({ row }) => {
      const lastLogin = row.getValue("lastLogin");
      return (
        <div>{lastLogin ? new Date(lastLogin as string).toLocaleString() : "Never"}</div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row, table }) => {
      const user = row.original;
      const tableInstance = table as any;

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
            <DropdownMenuItem
              onClick={() => tableInstance?.setSelectedUser?.(user.id, 'view')}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => tableInstance?.setSelectedUser?.(user.id, 'edit')}
            >
              Edit user
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => tableInstance?.handleDelete?.(user.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface UserTableProps {
  roleFilter?: string;
}

export function UserTable({ roleFilter }: UserTableProps) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [dialogMode, setDialogMode] = React.useState<'view' | 'edit' | 'create' | null>(null);

  const fetchUsers = React.useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });
      if (roleFilter) {
        params.append('role', roleFilter);
      }
      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalCount(data.pagination.totalCount);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [pageSize, roleFilter]);

  React.useEffect(() => {
    fetchUsers(1);
  }, [roleFilter, fetchUsers]);

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchUsers(currentPage);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleSetSelectedUser = (userId: string, mode: 'view' | 'edit') => {
    setSelectedUserId(userId);
    setDialogMode(mode);
  };

  const handleDialogClose = () => {
    setSelectedUserId(null);
    setDialogMode(null);
  };

  const handleUserSuccess = () => {
    fetchUsers(currentPage);
    handleDialogClose();
  };

  const handleEditUser = (user: any) => {
    setSelectedUserId(user.id);
    setDialogMode('edit');
  };

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Add methods to table instance for dropdown callbacks
  (table as any).setSelectedUser = handleSetSelectedUser;
  (table as any).handleDelete = handleDelete;

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {users.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} users
        </div>
        <Button
          onClick={() => setDialogMode('create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users?.length ? (
              users.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column, columnIndex) => {
                    const accessorKey = (column as any).accessorKey;
                    const cell = {
                      original: row,
                      getValue: () => accessorKey ? (row as any)[accessorKey] : undefined,
                    };
                    return (
                      <TableCell key={`${row.id}-${columnIndex}`}>
                        {flexRender(column.cell, { row: cell, table } as any)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => fetchUsers(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => fetchUsers(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>

      {/* Dialogs */}
      <EditUserModal
        isCreate={dialogMode === 'create'}
        user={dialogMode === 'edit' ? { id: selectedUserId } : undefined}
        onClose={handleDialogClose}
        onSuccess={handleUserSuccess}
        isOpen={dialogMode === 'create' || dialogMode === 'edit'}
      />

      {dialogMode === 'view' && selectedUserId && (
        <UserDetailsDialog
          userId={selectedUserId}
          onClose={handleDialogClose}
          onEdit={handleEditUser}
        />
      )}
    </div>
  );
}
