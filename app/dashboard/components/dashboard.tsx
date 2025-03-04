'use client';

import Chart from './revenue-chart';
import Greeting from './greeting';
import Revenue from './revenue';
import Invoices from './invoices';
import Outstanding from './outstanding';
import RecentInvoices from './recent-invoices';
import RecentBills from './recent-bills';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/hooks/use-firestore';
import { useEffect } from 'react';
import { useUserStore } from '@/store/use-user';
import { useProfileStore } from '@/store/use-profile';
import { useAnalyticsStore } from '@/store/use-analytics';

export default function Dashboard() {
	const { user, authLoading } = useAuth();
	const { getUser, getProfile, getAnalytics } = useFirestore();
	const { userData } = useUserStore();
	const { profile } = useProfileStore();
	const { analytics } = useAnalyticsStore();

	useEffect(() => {
		async function fetchData() {
			if (user?.uid) {
				if (!analytics) {
					await getAnalytics();
				}

				if (!userData) {
					await getUser();
				}

				if (!profile) {
					await getProfile();
				}
			}
		}

		fetchData();
	}, [authLoading]);

	return (
		<div className='relative flex w-full flex-col overflow-clip'>
			<section className='flex h-full flex-1 flex-col gap-2 p-1 md:gap-8 md:p-8'>
				<div className='grid grid-cols-2 gap-2 md:gap-8 xl:grid-cols-4'>
					<Greeting />
					<Revenue />
					<Outstanding />
					<Invoices />
				</div>
				<div className='grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-2 xl:grid-cols-5'>
					<div className='col-span-1 row-span-1 md:col-span-2 xl:col-span-3 xl:row-span-2'>
						<Chart />
					</div>
					<div className='col-span-1 row-span-2 md:col-span-1 xl:col-span-2 xl:row-span-1'>
						<RecentInvoices />
					</div>
					<div className='col-span-1 row-span-2 md:col-span-1 xl:col-span-2 xl:row-span-1'>
						<RecentBills />
					</div>
				</div>
			</section>
		</div>
	);
}
