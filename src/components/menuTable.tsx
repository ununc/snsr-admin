import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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

export type DataItem = {
  id: string;
  name: string;
  description: string;
  owner: string;
  can_write: boolean;
  order: number;
};

const getColumns = (
  onEdit: (item: DataItem) => void,
  onDelete: (item: DataItem) => void,
  groupList: DataItem[]
): ColumnDef<DataItem>[] => [
  {
    accessorKey: "owner",
    header: "상위 그룹",
    cell: ({ row }) => (
      <span>
        {groupList?.find((item) => item.id === row.original.owner)?.name}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "description",
    header: "설명",
  },
  {
    accessorKey: "can_write",
    header: "권한",
    cell: ({ row }) => (
      <span>{row.original.can_write ? "관리자" : "뷰어"}</span>
    ),
  },
  {
    accessorKey: "order",
    header: "메뉴 순서",
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
  data: DataItem[];
  groupList: DataItem[];
  onEdit: (item: DataItem) => void;
  onDelete: (item: DataItem) => void;
}

export function DataTable({
  data,
  groupList,
  onEdit,
  onDelete,
}: Readonly<DataTableProps>) {
  const columns = getColumns(onEdit, onDelete, groupList);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
