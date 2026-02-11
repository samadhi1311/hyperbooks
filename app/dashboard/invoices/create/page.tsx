'use client';

import FormView from '@/components/invoices/form-view';
import InvoiceView from '@/components/invoices/invoice-view';
import Menu from '@/components/menu';
import { useViewStore } from '@/store/use-view';

export default function CreateInvoice() {
	const { view } = useViewStore();

	return (
		<div className='mx-auto min-h-screen flex w-full flex-col items-center justify-center'>
			<Menu />
			{view === 'form' ? <FormView /> : <InvoiceView />}
		</div>
	);
}
