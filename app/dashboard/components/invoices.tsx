import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { useProfileStore } from '@/store/use-profile';
import { useEffect, useState } from 'react';

export default function Invoices() {
	const { profile } = useProfileStore();
	const [count, setCount] = useState(0);

	useEffect(() => {
		setCount(profile?.totalInvoiceCount ?? 0);
	}, [profile?.totalInvoiceCount]);
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>Total Issued</CardTitle>
				<DollarSign className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<NumberFlow className='text-2xl font-bold' value={count} />
			</CardContent>
		</Card>
	);
}
