'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import templates, { TemplateKey } from '@/templates';
import { useTemplateStore } from '@/store/use-templates';
import { useInvoiceStore } from '@/store/use-invoice';
import { Suspense, useEffect, useState } from 'react';
import Loader from '@/components/ui/loader';
import { useFirestore } from '@/hooks/use-firestore';
import { ProfileData, Template } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { TemplateCustomizer } from '@/components/template-customizer';
import { canCustomizeTemplates } from '@/templates';
import { useUserStore } from '@/store/use-user';
import { generateInvoiceRef } from '@/lib/utils';

export default function InvoiceView() {
	const { user, authLoading } = useAuth();
	const { getProfile } = useFirestore();
	const { selectedTemplate } = useTemplateStore();

	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [customization, setCustomization] = useState<Template | undefined>(undefined);

	const { invoiceData, updateInvoiceData, updateBilledToData, updateItemData, addItem, removeItem, updateAdditionalCharge, addAdditionalCharge, removeAdditionalCharge, updateRef } = useInvoiceStore();
	const { userData } = useUserStore();

	useEffect(() => {
		setCustomization((prev) => ({
			...prev,
			templateKey: selectedTemplate,
			colors: templates[selectedTemplate as TemplateKey]?.defaultColors,
		}));
	}, [selectedTemplate]);

	const handleCustomizationChange = (newCustomization: Template) => {
		setCustomization(newCustomization);
	};

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
		} else if (path === 'additionalCharges') {
			if (index === -1) {
				// Add new charge
				addAdditionalCharge();
			} else {
				// Update existing charge
				updateAdditionalCharge(index, { [field || 'description']: value });
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
				// You could also fetch saved customizations here
				// const savedCustomization = await getCustomization(user.uid);
				// if (savedCustomization) setCustomization(savedCustomization);
			};
			fetchProfile();
		}
	}, [authLoading]);

	// Generate invoice reference when profile is loaded and ref is empty
	useEffect(() => {
		if (profile?.name && (!invoiceData.ref || invoiceData.ref.trim() === '')) {
			const newRef = generateInvoiceRef(profile.name);
			updateRef(newRef);
		}
	}, [profile?.name, invoiceData.ref, updateRef]);

	if (!selectedTemplate || !profile?.name) return <Loader />;

	const SelectedTemplate = templates[selectedTemplate as TemplateKey].component;

	const canCustomize = canCustomizeTemplates(userData?.plan);

	return (
		<PageWrapper>
			<Section className='mx-auto w-full max-w-screen-md'>
				{canCustomize && (
					<div className='mb-4 flex justify-end'>
						<TemplateCustomizer templateKey={selectedTemplate} customization={customization} onCustomizationChange={handleCustomizationChange} />
					</div>
				)}
				<Suspense fallback={<Loader />}>
					<SelectedTemplate profile={profile} data={invoiceData} removeItem={removeItem} onEdit={handleNestedInputChange} onArrayEdit={handleArrayChange} customization={customization} />
				</Suspense>
			</Section>
		</PageWrapper>
	);
}
