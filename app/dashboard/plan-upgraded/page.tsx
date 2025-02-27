'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import Loader from '@/components/ui/loader';
import { A, H1, P } from '@/components/ui/typography';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/hooks/use-firestore';
import { useUserStore } from '@/store/use-user';
import { useEffect, useState } from 'react';

export default function PlanUpgraded() {
	const [success, setSuccess] = useState(false);
	const { user, authLoading } = useAuth();
	const { getUser, loading } = useFirestore();
	const { clearUser, userData } = useUserStore();

	useEffect(() => {
		async function checkStatus() {
			if (user) {
				clearUser();
				await getUser();
				if (userData && !loading) {
					if (userData.subscription_status === 'active' && (userData.plan === 'pro' || userData.plan === 'ultimate')) {
						setSuccess(true);
					}
				}
			}
		}
		checkStatus();
	}, [authLoading]);

	if (authLoading || loading) return <Loader />;

	return (
		<PageWrapper className='flex flex-col items-center justify-center'>
			<Section variant='main' className='mx-auto max-w-screen-sm'>
				{success ? (
					<>
						<H1 className='mb-8 text-center'>Welcome to the other side of hyperbooks.</H1>
						<P>Your have successfully subscribed to hyperbooks. Thank you for the support and enjoy the perks.</P>
					</>
				) : (
					<>
						<H1 className='mb-8 text-center'>Your subscription has been cancelled.</H1>
						<P>Your subscription has been cancelled. You can re-subscribe anytime.</P>
					</>
				)}
				<P className='mt-4'>If you need any assistance contact us via,</P>
				<ul className='list-inside list-disc indent-4'>
					<li>
						<A href='mailto:hyperbooks@hyperreal.cloud'>hyperbooks@hyperreal.cloud</A>
					</li>
					<li>
						<A href='tel:+94782752500'>+94 78 275 2500</A>
					</li>
				</ul>
			</Section>
		</PageWrapper>
	);
}
