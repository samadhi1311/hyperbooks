'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ChevronRightIcon, CircleCheckIcon, CircleXIcon, DownloadIcon, MoreHorizontal, Trash2Icon } from 'lucide-react';
import { InvoiceData, ProfileData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { P } from '@/components/ui/typography';
import { motion, AnimatePresence } from 'motion/react';
import templates, { TemplateKey } from '@/templates';
import { Document, pdf } from '@react-pdf/renderer';
import { Timestamp } from 'firebase/firestore';
import { fmtPrice } from '@/lib/utils';
import { PageSize } from '@/templates';
import { useUserStore } from '@/store/use-user';

const expandAnimation = {
	initial: { height: 0, opacity: 0 },
	animate: {
		height: 'auto',
		opacity: 1,
		transition: {
			height: { duration: 0.3 },
			opacity: { duration: 0.2 },
		},
	},
	exit: {
		height: 0,
		opacity: 0,
		transition: {
			height: { duration: 0.3 },
			opacity: { duration: 0.1 },
		},
	},
};

const ExpandableRow = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => (
	<div className='w-full'>
		<AnimatePresence mode='wait'>
			{isOpen && (
				<motion.div {...expandAnimation} className='w-full'>
					<div className='w-full py-2'>{children}</div>
				</motion.div>
			)}
		</AnimatePresence>
	</div>
);

export const columns = ({
	expandedRow,
	toggleRow,
	profile,
	selectedTemplate,
	selectedPageSize,
	toast,
	deleteInvoice,
	updateStatus,
}: {
	expandedRow: string | null;
	toggleRow: (rowId: string) => void;
	profile: ProfileData;
	selectedTemplate: string;
	selectedPageSize: PageSize;
	toast: any;
	deleteInvoice: (invoiceId: string) => void;
	updateStatus: (invoiceId: string, status: boolean) => void;
}): ColumnDef<InvoiceData>[] => [
	{
		accessorKey: 'id',
		header: '#',
		size: 70,
		cell: ({ row }) => (
			<div className='text-muted-foreground'>
				<Button variant='ghost' size='icon' onClick={() => toggleRow(row.id)}>
					<ChevronRightIcon className={`transition-transform duration-200 ${expandedRow === row.id ? 'rotate-90' : ''}`} />
					{row.index + 1}
				</Button>
			</div>
		),
	},
	{
		accessorKey: 'billedTo',
		header: 'Billed to',
		size: 300,
		cell: ({ row }) => {
			const { name, address, email, phone } = row.original.billedTo;
			return (
				<div className='w-full min-w-[250px]'>
					<span className='font-medium'>{name}</span>
					<ExpandableRow isOpen={expandedRow === row.id}>
						<div className='grid w-full gap-2 text-muted-foreground'>
							<span>
								<P variant='sm'>Address:</P>
								<P variant='sm'>{address?.join(', ')}</P>
							</span>
							<span>
								<P variant='sm'>Email:</P>
								<P variant='sm'>{email}</P>
							</span>
							<span>
								<P variant='sm'>Phone:</P>
								<P variant='sm'>{phone}</P>
							</span>
						</div>
					</ExpandableRow>
				</div>
			);
		},
	},
	{
		accessorKey: 'items',
		header: 'Items',
		cell: ({ row }) => {
			const items = row.getValue('items') as InvoiceData['items'];
			return (
				<div className='w-full min-w-[250px]'>
					<span>{items.length !== 1 ? `${items.length} items` : `${items.length} item`}</span>
					<ExpandableRow isOpen={expandedRow === row.id}>
						<div className='w-full'>
							{items.map((item, index) => (
								<div key={index} className='grid w-full grid-cols-4'>
									<span className='text-muted-foreground'>{item.description}</span>
									<span className='text-muted-foreground'> x {item.quantity}</span>
									<span className='text-muted-foreground'> LKR {item.amount && fmtPrice(item.amount)}</span>
									<span>LKR {item.amount && item.quantity ? fmtPrice(item.amount * item.quantity) : 0}</span>
								</div>
							))}
						</div>
					</ExpandableRow>
				</div>
			);
		},
	},
	{
		accessorKey: 'discount',
		header: 'Discount',
		cell: ({ row }) => `${row.getValue('discount')}%`,
	},
	{
		accessorKey: 'tax',
		header: 'Tax',
		cell: ({ row }) => `${row.getValue('tax')}%`,
	},
	{
		accessorKey: 'total',
		header: () => <div className='text-right'>Total</div>,
		cell: ({ row }) => {
			const items = row.getValue('items') as InvoiceData['items'];
			const subtotal = items.reduce((sum, item) => sum + (item.amount || 0) * (item.quantity || 1), 0);
			const discount = row.getValue('discount') as number;
			const tax = row.getValue('tax') as number;

			const total = subtotal * (1 - discount / 100) * (1 + tax / 100);

			return <div className='text-right font-medium'>LKR {fmtPrice(total)}</div>;
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
		accessorKey: 'complete',
		header: () => <div className='text-center'>Status</div>,
		cell: ({ row }) => {
			const status = row.getValue('complete') as boolean;
			return (
				<div className='flex justify-center'>
					{status ? (
						<span className='flex items-center gap-3'>
							<CircleCheckIcon className='text-emerald-500' />
							Completed
						</span>
					) : (
						<span className='flex items-center gap-3'>
							<CircleXIcon className='text-orange-500' />
							Incomplete
						</span>
					)}
				</div>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const { userData } = useUserStore();
			const handleExportPDF = async () => {
				try {
					const invoicePayload = {
						data: row.original,
						profile: profile as ProfileData,
					};
					const SelectedRenderer = templates[selectedTemplate as TemplateKey].render;
					const pdfDoc = <Document title="Invoice">{SelectedRenderer({ ...invoicePayload, pageSize: selectedPageSize, userData })}</Document>;

					const blob = await pdf(pdfDoc).toBlob();

					const link = document.createElement('a');
					link.href = URL.createObjectURL(blob);
					link.download = 'invoice.pdf';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					URL.revokeObjectURL(link.href);
					toast({
						variant: 'default',
						title: 'Invoice ready to share!',
						description: `Your invoice has been exported successfully as PDF!`,
					});
				} catch (error) {
					toast({
						variant: 'destructive',
						title: 'An error occurred.',
						description: `Couldn't export to PDF. Please try again.`,
					});
					console.error('Error exporting PDF:', error);
				}
			};

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
						<DropdownMenuItem className='flex cursor-pointer items-center gap-3' onClick={() => updateStatus(row.original.id!, !row.original.complete)}>
							{row.original.complete === false ? <CircleCheckIcon className='text-emerald-500' /> : <CircleXIcon className='text-orange-500' />}
							Mark as {row.original.complete === false ? 'Complete' : 'Incomplete'}
						</DropdownMenuItem>
						<DropdownMenuItem className='flex cursor-pointer items-center gap-3' onClick={() => handleExportPDF()}>
							<DownloadIcon />
							Download PDF
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className='flex cursor-pointer items-center gap-3' onClick={() => deleteInvoice(row.original.id!)}>
							<Trash2Icon />
							Delete Record
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
