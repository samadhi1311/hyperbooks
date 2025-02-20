import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BillData } from '@/lib/types';
import { useBillPaginationStore } from '@/store/use-bill-pagination';
import NumberFlow from '@number-flow/react';
import { ListRestartIcon } from 'lucide-react';

export default function RecentBills() {
	const { documents, loading } = useBillPaginationStore();
	const data = documents as BillData[];

	return (
		<Card className='relative z-10 h-full bg-background/60 shadow-md backdrop-blur-sm'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3 text-base text-muted-foreground'>
					<ListRestartIcon className='size-5' />
					Recent Bills
				</CardTitle>
			</CardHeader>
			<CardContent className='flex w-full flex-col gap-4'>
				{loading ? (
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
						<div className='flex items-center gap-4' key={index}>
							<Avatar className='hidden h-9 w-9 sm:flex'>
								<AvatarFallback className='bg-muted text-muted-foreground'>
									{doc.description
										.split(' ')
										.slice(0, 2)
										.map((word) => word.charAt(0).toUpperCase())
										.join('')}
								</AvatarFallback>
							</Avatar>
							<div className='grid gap-0.5'>
								<p className='w-[200px] truncate pb-px text-sm font-medium leading-none'>{doc.description}</p>
								<p className='text-sm text-muted-foreground'>
									{doc.createdAt?.toDate().toLocaleString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
										hour12: true,
									})}
								</p>
							</div>
							<div className='ml-auto font-medium'>
								<NumberFlow value={doc.amount} format={{ style: 'currency', currency: 'LKR' }} />
							</div>
						</div>
					))
				) : (
					<div className='mb-4'>
						<p className='text-sm font-medium leading-none text-muted-foreground/50'>Your recent bills will appear here.</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
