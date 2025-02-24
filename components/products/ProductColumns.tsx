"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import Image from "next/image";

export const columns: ColumnDef<ProductType>[] = [
 
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link href={`/products/${row.original._id}`} className="hover:text-red-1">
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) =>
      row.original.collections.map((collection) => collection.title).join(", "),
  },
  {
    accessorKey: "price",
    header: "Price (₪)",
  },
  {
    accessorKey: "expense",
    header: "Expense (₪)",
  },
  {
    accessorKey: "media",
    header: "Image",
    cell: ({ row }) => {
      const media = row.original.media;
      return (
        <div className="w-12 h-12 relative">
          {media && media.length > 0 ? (
            <Image
              src={media[0]}
              alt="Product Image"
              fill
              className="rounded-md object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="product" id={row.original._id} />,
  },
];
