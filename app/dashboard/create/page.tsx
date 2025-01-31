'use client';

import { PageWrapper } from '@/components/ui/layout';
import templates, { TemplateKey } from '@/templates';
import { useTemplateStore } from '@/store/use-templates';
import { useInvoiceStore } from '@/store/use-invoice';
import Menu from '@/components/menu';
import { Suspense, useEffect, useState } from 'react';
import Loader from '@/components/ui/loader';
import { useFirestoreAdd } from '@/hooks/use-firestore';
import { ProfileData } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

export default function CreateInvoice() {
	const { user, authLoading } = useAuth();
	const { getUserProfile } = useFirestoreAdd();
	const { selectedTemplate } = useTemplateStore();

	const [profile, setProfile] = useState<ProfileData | null>(null);

	// Replace useState with Zustand store
	const { invoiceData, updateInvoiceData, updateBilledToData, updateItemData, addItem } = useInvoiceStore();

	// Modify existing handlers to use Zustand methods
	const handleNestedInputChange = (path: string, value: string) => {
		const keys = path.split('.');
		if (keys[0] === 'billedTo') {
			updateBilledToData({ [keys[1]]: value });
		} else {
			updateInvoiceData({ [keys[0]]: value });
		}
	};

	const handleArrayChange = (path: string, index: number, value: any, field?: string) => {
		if (path === 'items') {
			if (index === -1) {
				// Add new item
				addItem();
			} else {
				// Update existing item
				updateItemData(index, { [field || 'description']: value });
			}
		} else if (path === 'billedTo.address') {
			const newAddress = invoiceData.billedTo.address ? [...invoiceData.billedTo.address] : [];
			newAddress[index] = value;
			updateBilledToData({ address: newAddress });
		}
	};

	useEffect(() => {
		if (user?.uid) {
			const fetchProfile = async () => {
				const profileData = await getUserProfile();
				setProfile(profileData);
			};
			fetchProfile();
		}
	}, [authLoading]);

	if (!selectedTemplate || !profile?.name) return <Loader />;

	const SelectedTemplate = templates[selectedTemplate as TemplateKey].component;

	return (
		<PageWrapper>
			<div className='my-16 grid items-center justify-center'>
				<Menu />

				<Suspense fallback={<Loader />}>
					<SelectedTemplate profile={profile} data={invoiceData} onEdit={handleNestedInputChange} onArrayEdit={handleArrayChange} />
				</Suspense>
			</div>
		</PageWrapper>
	);
}
