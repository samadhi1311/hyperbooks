'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import templates, { TemplateKey } from '@/templates';
import { useTemplateStore } from '@/store/use-templates';
import { useInvoiceStore } from '@/store/use-invoice';
import { Suspense, useEffect, useState } from 'react';
import Loader from '@/components/ui/loader';
import { useFirestore } from '@/hooks/use-firestore';
import { ProfileData } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

export default function InvoiceView() {
	const { user, authLoading } = useAuth();
	const { getProfile } = useFirestore();
	const { selectedTemplate } = useTemplateStore();

	const [profile, setProfile] = useState<ProfileData | null>(null);

	const { invoiceData, updateInvoiceData, updateBilledToData, updateItemData, addItem, removeItem } = useInvoiceStore();

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
				const profileData = await getProfile();
				setProfile(profileData);
			};
			fetchProfile();
		}
	}, [authLoading]);

	if (!selectedTemplate || !profile?.name) return <Loader />;

	const SelectedTemplate = templates[selectedTemplate as TemplateKey].component;

	return (
		<PageWrapper>
			<Section className='mx-auto w-full max-w-screen-md'>
				<Suspense fallback={<Loader />}>
					<SelectedTemplate profile={profile} data={invoiceData} removeItem={removeItem} onEdit={handleNestedInputChange} onArrayEdit={handleArrayChange} />
				</Suspense>
			</Section>
		</PageWrapper>
	);
}
