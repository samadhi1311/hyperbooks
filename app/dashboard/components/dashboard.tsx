'use client';

import Chart from './revenue-chart';
import Greeting from './greeting';
import Revenue from './revenue';
import Invoices from './invoices';
import Outstanding from './outstanding';
import Recent from './recent';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/hooks/use-firestore';
import { useEffect } from 'react';
import { useUserStore } from '@/store/use-user';
import { useProfileStore } from '@/store/use-profile';

export default function Dashboard() {
	const { user, authLoading } = useAuth();
	const { getUser, getProfile } = useFirestore();
	const { setUser } = useUserStore();
	const { setProfile } = useProfileStore();

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
			}
		}

		fetchData();
	}, [user, authLoading]);

	return (
		<div className='flex min-h-svh w-full flex-col'>
			<main className='flex h-full flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
				<div className='grid gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-4'>
					<Greeting />
					<Revenue />
					<Outstanding />
					<Invoices />
				</div>
				<div className='grid h-full gap-4 md:gap-8 xl:grid-cols-5 2xl:grid-cols-3'>
					<div className='h-full xl:col-span-3 2xl:col-span-2'>
						<Chart />
					</div>

					<div className='h-full xl:col-span-2 2xl:col-span-1'>
						<Recent />
					</div>
				</div>
			</main>
		</div>
	);
}
