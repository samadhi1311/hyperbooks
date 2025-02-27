'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { InvoiceData } from '@/lib/types';
import { usePaginationStore } from '@/store/use-pagination';
import { useUserStore } from '@/store/use-user';
import { ListRestartIcon } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export default function RecentInvoices() {
	const { userData } = useUserStore();
	const { documents, loading } = usePaginationStore();
	const data = documents as InvoiceData[];

	if (!data) return null;

	return (
		<Card className='relative z-10 h-full bg-background/60 shadow-md backdrop-blur-sm'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3 text-base text-muted-foreground'>
					<ListRestartIcon className='size-5' />
					Recent Invoices
				</CardTitle>
			</CardHeader>
			<CardContent className='flex w-full flex-col gap-4'>
				{loading && !documents.length ? (
					Array.from({ length: 5 }).map((_, index) => (
						<div className='flex items-center space-x-4' key={index}>
							<Skeleton className='h-9 w-9 rounded-full' />
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[250px]' />
								<Skeleton className='h-4 w-[200px]' />
							</div>
						</div>
					))
				) : data.length > 0 ? (
					data.slice(0, 5).map((doc, index) => (
						<div className='flex items-start gap-4' key={index}>
							<Avatar className='size-8'>
								<AvatarFallback className='bg-muted text-muted-foreground'>
									{doc.billedTo.name
										.split(' ')
										.slice(0, 2)
										.map((word) => word.charAt(0).toUpperCase())
										.join('')}
								</AvatarFallback>
							</Avatar>
							<div className='grid gap-0.5'>
								<span className='inline-block font-medium sm:hidden'>{userData?.currency + ' ' + doc.total.toFixed(2)}</span>
								<p className='w-[200px] truncate pb-px text-sm font-medium leading-none'>{doc.billedTo.name}</p>
								<p className='text-xs text-muted-foreground'>
									{doc.createdAt && Timestamp.prototype.isPrototypeOf(doc.createdAt)
										? doc.createdAt.toDate().toLocaleString('en-US', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
												hour12: true,
										  })
										: 'Date not available'}
								</p>
							</div>
							<span className='ml-auto hidden font-medium sm:inline-block'>{userData?.currency + ' ' + doc.total.toFixed(2)}</span>
						</div>
					))
				) : (
					<div className='mb-4'>
						<p className='text-sm font-medium leading-none text-muted-foreground/50'>Your recent invoices will appear here.</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
