import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { useState } from "react";
import { DataItem } from "./menuTable";
import { IUserInfo } from "./userTable";

export interface ZoZic {
  id?: string;
  name: string;
  user_pid_list: string[];
  menu_id_list: string[];
}

const getColumns = (
  onEdit: (item: ZoZic) => void,
  onDelete: (item: ZoZic) => void,
  menuList: DataItem[],
  userList: IUserInfo[]
): ColumnDef<ZoZic>[] => [
  {
    accessorKey: "name",
    header: "조직명",
  },
  {
    accessorKey: "menu_id_list",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.menu_id_list.map((menu_id) => {
            const menu = menuList.find((menu) => menu.id === menu_id);
            return (
              <span key={menu?.id}>
                {menu?.name} {menu?.can_write ? "(관리자)" : "(뷰어)"}
              </span>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "user_pid_list",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.user_pid_list.map((user_pid) => {
            const user = userList.find((user) => user.pid === user_pid);
            return <span key={user?.pid}>{user?.name}</span>;
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "액션",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Button
            onClick={() => onEdit(row.original)}
            variant="outline"
            size="sm"
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(row.original)}
            variant="destructive"
            size="sm"
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];

interface DataTableProps {
  data: ZoZic[];
  onEdit: (item: ZoZic) => void;
  onDelete: (item: ZoZic) => void;
  menuList: DataItem[];
  userList: IUserInfo[];
}

export function ZozicTable({
  data,
  onEdit,
  onDelete,
  menuList,
  userList,
}: Readonly<DataTableProps>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = getColumns(onEdit, onDelete, menuList, userList);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
