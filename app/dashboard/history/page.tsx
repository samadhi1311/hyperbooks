'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { H2 } from '@/components/ui/typography';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import useFirestorePagination from '@/hooks/use-pagination';
import { useAuth } from '@/hooks/use-auth';
import Loader from '@/components/ui/loader';
import { InvoiceData } from '@/lib/types';

export default function History() {
	const { user, authLoading } = useAuth();
	const { documents, loading, error } = useFirestorePagination({
		userId: user?.uid || '',
		pageSize: 10,
	});

	if (authLoading || loading) return <Loader />;
	if (!user) return <Loader />;
	if (error) return <div>Error: {error}</div>;

	const data = documents as InvoiceData[];

	return (
		<PageWrapper>
			<Section>
				<H2 className='mb-4'>History</H2>
				<DataTable columns={columns} data={data} />
			</Section>
		</PageWrapper>
	);
}
