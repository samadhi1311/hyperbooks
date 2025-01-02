'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PageWrapper } from '@/components/ui/layout';
import { H1 } from '@/components/ui/typography';
import { InvoiceData } from '@/lib/types';
import templates, { TemplateKey } from '@/templates';
import { Document } from '@react-pdf/renderer';
import { useState } from 'react';
import dynamic from 'next/dynamic';

export default function PdfPage() {
	const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), {
		ssr: false,
		loading: () => <p>Loading...</p>,
	});

	const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), {
		ssr: false,
		loading: () => <p>Loading...</p>,
	});

	const [template, setTemplate] = useState<TemplateKey>('minimal');

	const [invoiceData, setInvoiceData] = useState<InvoiceData>({
		company: {
			name: 'hyperreal',
			address: ['No. 22/2', '3rd Cross', 'Colombo 910002'],
			email: 'hello@hyperreal.cloud',
			phone: '+94 78 275 2500',
			website: 'https://hyperreal.cloud',
			logo: '/logo-mono.svg',
		},
	});

	const handleNestedInputChange = (path: string, value: string) => {
		setInvoiceData((prevData) => {
			const keys = path.split('.');
			const lastKey = keys.pop() as string;

			const nestedObj = keys.reduce((acc: any, key) => acc[key], prevData);

			return {
				...prevData,
				[keys[0]]: {
					...nestedObj,
					[lastKey]: value,
				},
			};
		});
	};

	const handleArrayChange = (path: string, index: number, value: string) => {
		setInvoiceData((prevData) => {
			const keys = path.split('.');
			const lastKey = keys.pop() as string;

			const nestedObj = keys.reduce((acc: any, key) => acc[key], prevData);

			if (Array.isArray(nestedObj[lastKey])) {
				return {
					...prevData,
					[keys[0]]: {
						...nestedObj,
						[lastKey]: nestedObj[lastKey].map((item: string, idx: number) => (idx === index ? value : item)),
					},
				};
			} else {
				throw new Error(`Property at path ${path} is not an array`);
			}
		});
	};

	// Editor page
	const handleImageChange = (field: string, onEdit: (field: string, value: any) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onload = () => {
				if (reader.result) {
					onEdit(field, reader.result.toString());
				}
			};

			reader.readAsDataURL(file);
		}
	};
	if (!template) return;

	const SelectedTemplate = templates[template as TemplateKey].component;
	const SelectedRenderer = templates[template as TemplateKey].render;

	return (
		<PageWrapper className='mt-32'>
			<H1>PDF</H1>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger>Select</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<button onClick={() => setTemplate('minimal')}>Minimal</button>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<button onClick={() => setTemplate('classic')}>Classic</button>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<PDFDownloadLink document={<Document>{SelectedRenderer(invoiceData)}</Document>} fileName='invoice.pdf' className='btn btn-primary mt-4'>
				Export PDF
			</PDFDownloadLink>
			<div className='mt-16 grid grid-cols-2 gap-8'>
				<SelectedTemplate data={invoiceData} onEdit={handleNestedInputChange} onArrayEdit={handleArrayChange} onImageEdit={(field) => handleImageChange(field, handleNestedInputChange)} />

				<PDFViewer className='h-full w-full' showToolbar={false}>
					<Document>{SelectedRenderer(invoiceData)}</Document>
				</PDFViewer>
			</div>
		</PageWrapper>
	);
}
