import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import useFirestorePagination from '@/hooks/use-pagination';
import { InvoiceData } from '@/lib/types';
import NumberFlow from '@number-flow/react';
import { ListRestartIcon } from 'lucide-react';

export default function Recent() {
	const { user, authLoading } = useAuth();
	const { documents, loading } = useFirestorePagination({
		userId: user?.uid || '',
		pageSize: 10,
	});

	const data = documents as InvoiceData[];
	if (authLoading) return null;
	return (
		<Card className='h-full'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3'>
					<ListRestartIcon className='size-8' />
					Recent Sales
				</CardTitle>
			</CardHeader>
			<CardContent className='flex w-full flex-col gap-4'>
				{documents.length > 0 &&
					data.map((doc, index) => (
						<div className='flex items-center gap-4' key={index}>
							<Avatar className='hidden h-9 w-9 sm:flex'>
								<AvatarFallback className='bg-muted text-muted-foreground'>
									{doc.billedTo.name
										.split(' ')
										.slice(0, 2)
										.map((word) => word.charAt(0).toUpperCase())
										.join('')}
								</AvatarFallback>
							</Avatar>
							<div className='grid gap-1'>
								<p className='text-sm font-medium leading-none'>{doc.billedTo.name}</p>
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
								<NumberFlow value={doc.total} format={{ style: 'currency', currency: 'LKR' }} />
							</div>
						</div>
					))}
				{!loading && documents.length === 0 && (
					<div className='mb-4 flex h-full w-full flex-col items-center justify-center'>
						<p className='text-sm font-medium leading-none text-muted-foreground'>Your recent sales will appear here.</p>
					</div>
				)}
				{loading &&
					Array.from({ length: 8 }).map((_, index) => (
						<div className='flex items-center space-x-4' key={index}>
							<Skeleton className='h-12 w-12 rounded-full' />
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
