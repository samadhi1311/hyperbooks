'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { H2 } from '@/components/ui/typography';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { useAuth } from '@/hooks/use-auth';
import Loader from '@/components/ui/loader';
import { BillData } from '@/lib/types';
import { useFirestore } from '@/hooks/use-firestore';
import useBillsPagination from '@/hooks/use-bill-pagination';

export default function History() {
	const { user, authLoading } = useAuth();

	const { documents, loading, error, fetchNextPage, hasMore } = useBillsPagination({ userId: user?.uid || '', pageSize: 10 });
	const { deleteBill, loading: billLoading } = useFirestore();

	if (authLoading || !user) return <Loader />;
	if (error) return <div>Error: {error}</div>;

	const data = documents as BillData[];

	console.log(data);

	return (
		<PageWrapper>
			<Section>
				<H2 className='mb-4'>History</H2>
				<DataTable columns={columns({ deleteBill })} data={data} fetchNextPage={fetchNextPage} hasMore={hasMore} loading={loading} billLoading={billLoading} />
			</Section>
		</PageWrapper>
	);
}
