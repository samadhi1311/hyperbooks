'use client';

import Dashboard from './components/dashboard';
import { useEffect } from 'react';
import { useProfileStore } from '@/store/use-profile';
import { useFirestore } from '@/hooks/use-firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function Page() {
	const { user } = useAuth();
	const { profile, setProfile } = useProfileStore();
	const { getProfile } = useFirestore();
	const router = useRouter();

	useEffect(() => {
		const fetchProfile = async () => {
			if (user && !profile) {
				const profileData = await getProfile();
				if (profileData?.name) {
					setProfile(profileData);
				} else {
					router.replace('/dashboard/getting-started');
				}
			}
		};

		fetchProfile();
	}, [user, profile]);

	return <Dashboard />;
}
