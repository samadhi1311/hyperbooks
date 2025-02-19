'use client';

import { PageWrapper } from './ui/layout';
import { H1, P } from './ui/typography';

export default function Offline() {
	return (
		<PageWrapper className='flex flex-col items-center justify-center gap-2'>
			<img src='/logo.svg' alt='hyperbooks Logo' className='size-8' />

			<H1>You seem to be offline.</H1>

			<P className='text-center text-muted-foreground'>Please connect to Internet to continue using hyperbooks. We are working on bringing offline support soon.</P>
		</PageWrapper>
	);
}
