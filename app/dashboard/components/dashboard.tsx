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
	const { setUser } = useUserStore();
	const { setProfile } = useProfileStore();
	const { setAnalytics } = useAnalyticsStore();

	useEffect(() => {
		async function fetchData() {
			if (user?.uid) {
				const userdata = await getUser();
				if (userdata) {
					setUser(userdata);
				}

				const profile = await getProfile();
				if (profile) {
					setProfile(profile);
				}

				const analytics = await getAnalytics();
				if (analytics) {
					setAnalytics(analytics);
				}
			}
		}

		fetchData();
	}, [user, authLoading]);

	return (
		<div className='relative flex w-full flex-col overflow-clip'>
			<section className='flex h-full flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
				<div className='grid gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-4'>
					<Greeting />
					<Revenue />
					<Outstanding />
					<Invoices />
				</div>
				<div className='grid h-full grid-cols-1 grid-rows-1 gap-4 md:gap-8 xl:grid-cols-5 xl:grid-rows-2 xl:gap-y-8 2xl:grid-cols-3'>
					<div className='h-full xl:col-span-3 xl:row-span-2 2xl:col-span-2'>
						<Chart />
					</div>

					<div className='xl:col-span-2 2xl:col-span-1'>
						<RecentInvoices />
					</div>
					<div className='xl:col-span-2 2xl:col-span-1'>
						<RecentBills />
					</div>
				</div>
			</section>
		</div>
	);
}
