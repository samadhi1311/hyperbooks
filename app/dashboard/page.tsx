'use client';

import Chart from './components/revenue-chart';
import Greeting from './components/greeting';
import Revenue from './components/revenue';
import Invoices from './components/invoices';
import Outstanding from './components/outstanding';
import RecentInvoices from './components/recent-invoices';
import RecentBills from './components/recent-bills';

export default function Dashboard() {
	return (
		<div className='relative flex w-full flex-col overflow-clip'>
			<section className='flex h-full flex-1 flex-col gap-2 p-1 md:gap-8 md:p-8'>
				<div className='grid grid-cols-2 gap-2 md:gap-8 xl:grid-cols-4'>
					<Greeting />
					<Revenue />
					<Outstanding />
					<Invoices />
				</div>
				<div className='grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-2 xl:grid-cols-5'>
					<div className='col-span-1 row-span-1 md:col-span-2 xl:col-span-3 xl:row-span-2'>
						<Chart />
					</div>
					<div className='col-span-1 row-span-2 md:col-span-1 xl:col-span-2 xl:row-span-1'>
						<RecentInvoices />
					</div>
					<div className='col-span-1 row-span-2 md:col-span-1 xl:col-span-2 xl:row-span-1'>
						<RecentBills />
					</div>
				</div>
			</section>
		</div>
	);
}
