'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { H2 } from '@/components/ui/typography';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import useFirestorePagination from '@/hooks/use-pagination';
import { useAuth } from '@/hooks/use-auth';
import Loader from '@/components/ui/loader';
import { InvoiceData } from '@/lib/types';
import { useState } from 'react';
import { useProfileStore } from '@/store/use-profile';
import { useTemplateStore } from '@/store/use-templates';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';

export default function History() {
	const [expandedRow, setExpandedRow] = useState<string | null>(null);
	const toggleRow = (rowId: string) => {
		setExpandedRow(expandedRow === rowId ? null : rowId);
	};
	const { user, authLoading } = useAuth();
	const { documents, loading, error, fetchNextPage, hasMore } = useFirestorePagination({
		userId: user?.uid || '',
		pageSize: 10,
	});
	const { profile } = useProfileStore();
	const { selectedTemplate } = useTemplateStore();
	const { deleteInvoice, updateStatus, loading: invoiceLoading } = useFirestore();
	const { toast } = useToast();
	if (authLoading || !user || !profile) return <Loader />;
	if (error) return <div>Error: {error}</div>;

	const data = documents as InvoiceData[];

	return (
		<PageWrapper>
			<Section>
				<H2 className='mb-4'>History</H2>
				<DataTable
					columns={columns({ expandedRow, toggleRow, profile, selectedTemplate, toast, updateStatus, deleteInvoice })}
					data={data}
					fetchNextPage={fetchNextPage}
					hasMore={hasMore}
					loading={loading}
					invoiceLoading={invoiceLoading}
				/>
			</Section>
		</PageWrapper>
	);
}
