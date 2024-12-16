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
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { makeDate } from "@/util/makeDate";

export interface IUserInfo {
  pid: string;
  name: string;
  email: string | null;
  phone: string;
  birth: Date;
  sarang: string;
  daechung: boolean;
  created_at: Date;
}

const getColumns = (
  onEdit: (item: IUserInfo) => void,
  onDelete: (item: IUserInfo) => void
): ColumnDef<IUserInfo>[] => [
  {
    accessorKey: "daechung",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          대학/청년
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <span>{row.original.daechung ? "대학" : "청년"}</span>,
    sortingFn: (rowA, rowB) => {
      return rowA.original.daechung === rowB.original.daechung
        ? 0
        : rowA.original.daechung
        ? -1
        : 1;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          이름
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "sarang",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          사랑방
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "핸드폰",
  },
  {
    accessorKey: "birth",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          생일
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <span>{makeDate(row.original.birth)}</span>,
    sortingFn: (rowA, rowB) => {
      return (
        new Date(rowA.original.birth).getTime() -
        new Date(rowB.original.birth).getTime()
      );
    },
  },
  {
    accessorKey: "email",
    header: "이메일",
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
  data: IUserInfo[];
  onEdit: (item: IUserInfo) => void;
  onDelete: (item: IUserInfo) => void;
}

export function UserTable({
  data,
  onEdit,
  onDelete,
}: Readonly<DataTableProps>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = getColumns(onEdit, onDelete);

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
