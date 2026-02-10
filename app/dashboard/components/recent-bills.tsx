import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BillData } from '@/lib/types';
import { useBillPaginationStore } from '@/store/use-bill-pagination';
import { useUserStore } from '@/store/use-user';
import { ListRestartIcon } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { useMemo } from 'react';
import { fmtPrice } from '@/lib/utils';

export default function RecentBills() {
	const { userData } = useUserStore();
	const { documents, loading } = useBillPaginationStore();
	const data = documents as BillData[];

	const memoizedData = useMemo(
		() =>
			data.slice(0, 5).map((doc) => ({
				...doc,
				initials: doc.description
					.split(' ')
					.slice(0, 2)
					.map((word) => word.charAt(0).toUpperCase())
					.join(''),
				formattedDate:
					doc.createdAt && Timestamp.prototype.isPrototypeOf(doc.createdAt)
						? doc.createdAt.toDate().toLocaleString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								hour12: true,
						  })
						: 'Date not available',
			})),
		[data]
	);

	if (!memoizedData) return null;

	return (
		<Card className='relative z-10 h-full bg-background/60 shadow-none backdrop-blur-none sm:shadow-md sm:backdrop-blur-sm'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3 text-sm text-muted-foreground md:text-base'>
					<ListRestartIcon className='size-4 md:size-5' />
					Recent Bills
				</CardTitle>
			</CardHeader>
			<CardContent className='flex w-full flex-col gap-4'>
				{loading ? (
					Array.from({ length: 5 }).map((_, index) => (
						<div className='flex items-center space-x-4' key={index}>
							<Skeleton className='size-8 rounded-full' />
							<div className='space-y-2'>
								<Skeleton className='h-3 w-[250px]' />
								<Skeleton className='h-3 w-[200px]' />
							</div>
						</div>
					))
				) : memoizedData.length > 0 ? (
					memoizedData.slice(0, 5).map((doc, index) => (
						<div className='flex items-center gap-4 md:items-start' key={index}>
							<Avatar className='size-8'>
								<AvatarFallback className='bg-muted text-sm text-muted-foreground md:text-base'>{doc.initials}</AvatarFallback>
							</Avatar>
							<div className='grid gap-0.5'>
								<span className='inline-block text-sm font-medium xl:hidden'>
									{userData?.currency ?? 'USD'} {fmtPrice(doc.amount)}
								</span>
								<p className='w-[200px] truncate pb-px text-xs font-medium leading-none text-muted-foreground md:text-sm xl:text-foreground'>{doc.description}</p>
								<p className='text-xs text-muted-foreground'>{doc.formattedDate}</p>
							</div>
							<span className='ml-auto hidden font-medium xl:inline-block'>
								{userData?.currency ?? 'USD'} {fmtPrice(doc.amount)}
							</span>
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
