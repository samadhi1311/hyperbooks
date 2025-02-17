import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import useBillsPagination from '@/hooks/use-bill-pagination';
import { BillData } from '@/lib/types';
import NumberFlow from '@number-flow/react';
import { ListRestartIcon } from 'lucide-react';

export default function RecentBills() {
	const { user, authLoading } = useAuth();
	const { documents, loading } = useBillsPagination({
		userId: user?.uid || '',
		pageSize: 5,
	});

	const data = documents as BillData[];

	if (authLoading) return null;

	return (
		<Card className='relative z-10 bg-background/60 shadow-xl backdrop-blur-sm'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3 text-base text-muted-foreground'>
					<ListRestartIcon className='size-5' />
					Recent Bills
				</CardTitle>
			</CardHeader>
			<CardContent className='flex w-full flex-col gap-4'>
				{documents.length > 0 &&
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
							<div className='grid gap-1'>
								<p className='text-sm font-medium leading-none'>{doc.description}</p>
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
					))}
				{!loading && documents.length === 0 && (
					<div className='mb-4 flex w-full flex-col items-center justify-center'>
						<p className='text-sm font-medium leading-none text-muted-foreground'>Your recent sales will appear here.</p>
					</div>
				)}
				{loading &&
					documents.length === 0 &&
					Array.from({ length: 5 }).map((_, index) => (
						<div className='flex items-center space-x-4' key={index}>
							<Skeleton className='h-10 w-10 rounded-full' />
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[250px]' />
								<Skeleton className='h-4 w-[200px]' />
							</div>
						</div>
					))}
			</CardContent>
		</Card>
	);
}
