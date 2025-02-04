import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import useFirestorePagination from '@/hooks/use-pagination';
import { InvoiceData } from '@/lib/types';
import NumberFlow from '@number-flow/react';

export default function Recent() {
	const { user, authLoading } = useAuth();
	const { documents, loading } = useFirestorePagination({
		userId: user?.uid || '',
		pageSize: 10,
	});

	const data = documents as InvoiceData[];
	if (authLoading || loading) return null;
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Sales</CardTitle>
			</CardHeader>
			<CardContent className='grid gap-8'>
				{data.map((doc, index) => (
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
			</CardContent>
		</Card>
	);
}
