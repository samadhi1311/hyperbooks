'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Loader from './ui/loader';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { user, authLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!authLoading && !user) {
			router.replace('/login');
		}
	}, [user, authLoading, router]);

	if (authLoading) {
		return <Loader />;
	}

	if (!user) {
		return null;
	}

	return children;
};
