'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { InvoiceData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<InvoiceData>[] = [
	{
		accessorKey: 'billedTo',
		header: 'Billed to',
	},
	{
		accessorKey: 'items',
		header: 'Items',
		cell: ({ row }) => {
			const items = row.getValue('items') as InvoiceData['items'];
			const total = items.reduce((sum, item) => sum + (item.amount || 0) * (item.quantity || 1), 0);
			return (
				<div className='text-right'>
					{items.length} items (${total.toFixed(2)})
				</div>
			);
		},
	},
	{
		accessorKey: 'discount',
		header: 'Discount',
		cell: ({ row }) => {
			const discount = row.getValue('discount') as number;
			return <div className='text-right'>{discount}%</div>;
		},
	},
	{
		accessorKey: 'tax',
		header: 'Tax',
		cell: ({ row }) => {
			const tax = row.getValue('tax') as number;
			return <div className='text-right'>{tax}%</div>;
		},
	},
	{
		id: 'total',
		header: () => <div className='text-right'>Total</div>,
		cell: ({ row }) => {
			const items = row.getValue('items') as InvoiceData['items'];
			const subtotal = items.reduce((sum, item) => sum + (item.amount || 0) * (item.quantity || 1), 0);
			const discount = row.getValue('discount') as number;
			const tax = row.getValue('tax') as number;

			const total = subtotal * (1 - discount / 100) * (1 + tax / 100);

			return <div className='text-right font-medium'>${total.toFixed(2)}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const invoice = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => window.print()}>Print Invoice</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View Details</DropdownMenuItem>
						<DropdownMenuItem>Download PDF</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
