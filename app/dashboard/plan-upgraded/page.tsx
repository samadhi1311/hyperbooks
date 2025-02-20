'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { A, H1, P } from '@/components/ui/typography';

export default function PlanUpgraded() {
	return (
		<PageWrapper className='flex flex-col items-center justify-center'>
			<Section variant='main' className='mx-auto max-w-screen-sm'>
				<H1 className='mb-8 text-center'>Welcome to the other side of hyperbooks.</H1>
				<P>Your have successfully subscribed to hyperbooks. Thank you for the support and enjoy the perks.</P>
				<P className='mt-4'>If you need any assistance contact us via,</P>
				<ul className='list-inside list-disc indent-4'>
					<li>
						<A href='mailto:hyperbooks@hyperreal.cloud'>hyperbooks@hyperreal.cloud</A>
					</li>
					<li>
						<A href='tel:+94782752500'>+94 78 275 2500</A>
					</li>
				</ul>
			</Section>
		</PageWrapper>
	);
}
