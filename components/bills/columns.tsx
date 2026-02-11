'use client';

import { ColumnDef } from '@tanstack/react-table';
import { BillData } from '@/lib/types';
import { P } from '@/components/ui/typography';
import { Timestamp } from 'firebase/firestore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { expenseCategories } from '@/lib/constants';
import { fmtPrice } from '@/lib/utils';

export const columns = ({ deleteBill }: { deleteBill: (billId: string) => void }): ColumnDef<BillData>[] => [
	{
		accessorKey: 'id',
		header: '#',
		size: 70,
		cell: ({ row }) => <P className='text-muted-foreground'>{row.index + 1}</P>,
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'category',
		header: 'Category',
		cell: ({ row }) => {
			const currentCategory = expenseCategories.find((cat) => cat.value === row.original.category);
			return <P>{currentCategory?.label}</P>;
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ row }) => {
			const date = row.getValue('createdAt') as Timestamp;
			const formattedDate = date.toDate();
			const createdAt = new Date(formattedDate);
			return <P>{createdAt.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</P>;
		},
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ row }) => {
			const amount = row.getValue('amount') as number;
			return <P>LKR {fmtPrice(amount)}</P>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
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
						<DropdownMenuSeparator />

						<DropdownMenuItem className='flex cursor-pointer items-center gap-3' onClick={() => deleteBill(row.original.id!)}>
							<Trash2Icon />
							Delete Record
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
