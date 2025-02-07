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
	const { userData, setUser, clearUser } = useUserStore();
	const { profile, setProfile } = useProfileStore();

	useEffect(() => {
		if (user?.uid && (!userData || !profile)) {
			const fetchUser = async () => {
				const data1 = await getUser();
				const data2 = await getProfile();
				if (data1) {
					clearUser();
					setUser(data1);
				}
				if (data2) {
					setProfile(data2);
				}
			};
			fetchUser();
		}
	}, [authLoading]);

	return (
		<div className='flex min-h-svh w-full flex-col'>
			<main className='flex h-full flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
				<div className='grid gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-4'>
					<Greeting />
					<Revenue />
					<Outstanding />
					<Invoices />
				</div>
				<div className='grid h-full gap-4 md:gap-8 xl:grid-cols-2 2xl:grid-cols-3'>
					<div className='h-full xl:col-span-2'>
						<Chart />
					</div>

					<Recent />
				</div>
			</main>
		</div>
	);
}
