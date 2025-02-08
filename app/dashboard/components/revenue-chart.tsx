'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import NumberFlow from '@number-flow/react';
import { ChartColumnIncreasingIcon, Loader2Icon } from 'lucide-react';

export default function Chart() {
	const { user } = useAuth();
	const [chartData, setChartData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) return;
		const getLast30DaysInvoices = async () => {
			try {
				setLoading(true);
				const userDocRef = doc(db, 'users', user.uid);
				const userSnap = await getDoc(userDocRef);

				if (userSnap.exists()) {
					const last30DaysInvoices = userSnap.data().last30DaysInvoices || {};

					// Convert Firestore data into chart format
					const formattedData = Array.from({ length: 30 }, (_, i) => {
						const currentDay = new Date();
						const targetDay = subDays(currentDay, 29 - i); // Get the exact date for this index
						const dateKey = format(targetDay, 'yyyy-MM-dd'); // Use targetDay here

						// Ensure data is placed on the right date
						return {
							date: format(targetDay, 'MMM dd'), // Format the date as 'MMM dd' (e.g., Feb 07)
							revenue: last30DaysInvoices[dateKey] || 0,
						};
					});

					setChartData(formattedData);
				}
			} catch (error) {
				console.error('Error fetching last 30 days invoices:', error);
			} finally {
				setLoading(false);
			}
		};

		getLast30DaysInvoices();
	}, [user]);

	const chartConfig = {
		revenue: {
			label: 'Revenue',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	return (
		<Card className='overflow-hidden'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3'>
					<ChartColumnIncreasingIcon className='size-8' />
					Statistics
				</CardTitle>
				<CardDescription>Your revenue in the last 30 days</CardDescription>
			</CardHeader>
			<CardContent className='relative'>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey='date' tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value} />
						<ChartTooltip
							cursor={false}
							formatter={(value) => <NumberFlow value={value as number} className='text-base' prefix='LKR ' />}
							labelClassName='text-base font-medium'
							content={<ChartTooltipContent className='px-4 py-2' nameKey='revenue' />}
						/>
						<Bar dataKey='revenue' fill='var(--color-revenue)' radius={0} />
					</BarChart>
				</ChartContainer>
				{loading && (
					<div className='absolute inset-0 flex items-center justify-center bg-background'>
						<Loader2Icon className='animate-spin text-muted-foreground' />
					</div>
				)}

				{chartData.length === 0 && !loading && (
					<div className='absolute inset-0 flex items-center justify-center bg-background'>
						<p className='text-sm text-muted-foreground'>No data available.</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
