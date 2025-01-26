'use client';

import { PageWrapper } from '@/components/ui/layout';
import templates, { TemplateKey } from '@/templates';
import { useTemplateStore } from '@/store/use-templates';
import { useInvoiceStore } from '@/store/use-invoice';
import Menu from '@/components/menu';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';

export default function CreateInvoice() {
	const { selectedTemplate } = useTemplateStore();

	// Replace useState with Zustand store
	const { invoiceData, updateInvoiceData, updateCompanyData, updateItemData, addItem } = useInvoiceStore();

	// Modify existing handlers to use Zustand methods
	const handleNestedInputChange = (path: string, value: string) => {
		const keys = path.split('.');
		if (keys[0] === 'company') {
			updateCompanyData({ [keys[1]]: value });
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
		} else if (path === 'company.address') {
			const newAddress = [...invoiceData.company.address];
			newAddress[index] = value;
			updateCompanyData({ address: newAddress });
		}
	};

	const handleImageChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onload = () => {
				if (reader.result) {
					if (field === 'company.logo') {
						updateCompanyData({ logo: reader.result.toString() });
					}
				}
			};

			reader.readAsDataURL(file);
		}
	};

	if (!selectedTemplate) return null;

	const SelectedTemplate = templates[selectedTemplate as TemplateKey].component;

	return (
		<PageWrapper>
			<div className='my-16 grid items-center justify-center'>
				<Menu />

				<Suspense fallback={<Loader />}>
					<SelectedTemplate data={invoiceData} onEdit={handleNestedInputChange} onArrayEdit={handleArrayChange} onImageEdit={handleImageChange} />
				</Suspense>
			</div>
		</PageWrapper>
	);
}
