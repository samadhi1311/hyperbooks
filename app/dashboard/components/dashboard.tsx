'use client';

import Chart from './revenue-chart';
import Greeting from './greeting';
import Revenue from './revenue';
import Invoices from './invoices';
import Outstanding from './outstanding';
import Recent from './recent';

export const description =
	'An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image.';

export const iframeHeight = '825px';

export const containerClassName = 'h-full w-full';

export default function Dashboard() {
	return (
		<div className='flex min-h-screen w-full flex-col'>
			<main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
				<div className='grid gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-4'>
					<Greeting />
					<Revenue />
					<Invoices />
					<Outstanding />
				</div>
				<div className='grid gap-4 md:gap-8 xl:grid-cols-2 2xl:grid-cols-3'>
					<div className='xl:col-span-2' x-chunk='dashboard-01-chunk-4'>
						<Chart />
					</div>
					<Recent />
				</div>
			</main>
		</div>
	);
}
