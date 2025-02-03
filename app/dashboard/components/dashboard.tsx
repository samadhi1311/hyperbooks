'use client';

import Chart from './revenue-chart';
import Greeting from './greeting';
import Revenue from './revenue';
import Invoices from './invoices';
import Outstanding from './outstanding';
import Recent from './recent';
import { useAuth } from '@/hooks/use-auth';
import { useFirestoreAdd } from '@/hooks/use-firestore';
import { useEffect } from 'react';
import { useProfileStore } from '@/store/use-profile';
import Loader from '@/components/ui/loader';

export const iframeHeight = '825px';

export const containerClassName = 'h-full w-full';

export default function Dashboard() {
	const { user, authLoading } = useAuth();
	const { getUserProfile, loading } = useFirestoreAdd();
	const { setProfile, profile } = useProfileStore();

	useEffect(() => {
		if (user?.uid && profile === null) {
			const fetchProfile = async () => {
				const profileData = await getUserProfile();
				if (profileData) {
					setProfile(profileData);
				}
			};
			fetchProfile();
		}
	}, [authLoading]);

	if (authLoading || loading) return <Loader />;
	return (
		<div className='flex min-h-screen w-full flex-col'>
			<main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
				<div className='grid gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-4'>
					<Greeting />
					<Revenue />
					<Invoices />
					<Outstanding />
				</div>
				<div className='grid gap-4 md:gap-8 xl:grid-cols-2 2xl:grid-cols-3'>
					<div className='xl:col-span-2'>
						<Chart />
					</div>
					<Recent />
				</div>
			</main>
		</div>
	);
}
