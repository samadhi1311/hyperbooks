'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';

export default function Chart() {
	const { user } = useAuth();
	const [chartData, setChartData] = useState<any[]>([]);

	useEffect(() => {
		if (!user) return;
		const getLast30DaysInvoices = async () => {
			const userDocRef = doc(db, 'users', user.uid);
			const userSnap = await getDoc(userDocRef);

			if (userSnap.exists()) {
				const last30DaysInvoices = userSnap.data().last30DaysInvoices || {};

				// Convert Firestore data into chart format
				const formattedData = Array.from({ length: 30 }, (_, i) => {
					const dateKey = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd');
					return {
						date: format(subDays(new Date(), 29 - i), 'MMM dd'), // Format as 'Jan 01', 'Jan 02', etc.
						revenue: last30DaysInvoices[dateKey] || 0, // Default to 0 if no data
					};
				});

				setChartData(formattedData);
			}
		};

		getLast30DaysInvoices();
	}, [user]);

	if (!chartData.length) return null;

	const chartConfig = {
		revenue: {
			label: 'Revenue: LKR ',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Statistics</CardTitle>
				<CardDescription>Your revenue in the last 30 days</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey='date' tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value} />
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Bar dataKey='revenue' fill='var(--color-revenue)' radius={8} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
