'use client';

import { Section } from '@/components/ui/layout';
import { H2, P } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { LogInIcon } from 'lucide-react';

export default function CTA() {
	return (
		<Section className='relative'>
			<div className='flex flex-col items-center gap-4 py-8'>
				<H2>Start Creating Beautiful Invoices Today!</H2>
				<P className='max-w-2xl text-center text-muted-foreground'>
					Take the stress out of invoicing with our simple yet powerful tools. Sign up today and make your billing as polished as your business!
				</P>
				<Button variant='secondary' className='mt-4 flex items-center gap-2'>
					<LogInIcon />
					Sign up
				</Button>
			</div>
			<div className='absolute bottom-0 -z-50 h-full w-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-foreground/10 via-transparent to-transparent dark:from-foreground/5 dark:via-transparent dark:to-transparent' />
		</Section>
	);
}
