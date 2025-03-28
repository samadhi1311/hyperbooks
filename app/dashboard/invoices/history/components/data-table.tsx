'use client';

import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDownIcon, Loader2Icon } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { P } from '@/components/ui/typography';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	hasMore: boolean;
	fetchNextPage: () => void;
	loading: boolean;
	invoiceLoading: boolean;
}

export function DataTable<TData, TValue>({ columns, data, hasMore, fetchNextPage, loading, invoiceLoading }: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div>
			<div className='rounded-md border bg-muted/20'>
				<Table>
					<TableHeader className='bg-muted/50'>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{invoiceLoading || loading ? (
							<TableRow className='w-full'>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									<div className='flex items-center justify-center'>
										<Loader2Icon className='h-4 w-4 animate-spin' />
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className='align-top'>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							!loading &&
							!invoiceLoading &&
							table.getRowCount() === 0 && (
								<TableRow>
									<TableCell colSpan={columns.length} className='h-24 text-center'>
										No results.
									</TableCell>
								</TableRow>
							)
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<IconButton icon={loading ? <Loader2Icon className='animate-spin' /> : <ArrowDownIcon />} variant='outline' onClick={fetchNextPage} disabled={!hasMore || loading}>
					{loading ? 'Loading' : 'Load More'}
				</IconButton>
			</div>
			<div className='flex items-center justify-center py-4'>
				<P className='text-muted-foreground' variant='sm'>
					{!hasMore && !loading && !invoiceLoading && 'You have reached the end of the list.'}
				</P>
			</div>
		</div>
	);
}
