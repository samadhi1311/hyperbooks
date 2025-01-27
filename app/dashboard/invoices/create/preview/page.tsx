'use client';

import { PageWrapper } from '@/components/ui/layout';
import Loader from '@/components/ui/loader';
import { useInvoiceStore } from '@/store/use-invoice';
import { useTemplateStore } from '@/store/use-templates';
import templates, { TemplateKey } from '@/templates';
import { Document } from '@react-pdf/renderer';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

export default function ViewInvoice() {
	const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), {
		ssr: false,
		loading: () => <Loader />,
	});

	const { selectedTemplate } = useTemplateStore();
	const { invoiceData } = useInvoiceStore();
	const SelectedRenderer = templates[selectedTemplate as TemplateKey].render;

	return (
		<PageWrapper>
			<Suspense fallback={<Loader />}>
				<PDFViewer className='h-full w-full' showToolbar={true}>
					<Document>{SelectedRenderer(invoiceData)}</Document>
				</PDFViewer>
			</Suspense>
		</PageWrapper>
	);
}
