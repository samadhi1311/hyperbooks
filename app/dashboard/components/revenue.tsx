'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfileStore } from '@/store/use-profile';
import { DollarSign } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { useEffect, useState } from 'react';

export default function Revenue() {
	const { profile } = useProfileStore();
	const [income, setIncome] = useState(0);

	useEffect(() => {
		setIncome(profile?.totalIncome ?? 0);
	}, [profile?.totalIncome]);

	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
				<DollarSign className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<NumberFlow className='text-2xl font-bold' format={{ notation: 'standard', style: 'currency', currency: 'LKR' }} value={income} />
			</CardContent>
		</Card>
	);
}
