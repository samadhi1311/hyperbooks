import { PageWrapper } from '@/components/ui/layout';
import { A, H1, P } from '@/components/ui/typography';

export default function NotFound() {
	return (
		<PageWrapper className='flex flex-col items-center justify-center gap-2'>
			<img src='logo.svg' alt='hyperbooks Logo' className='size-8' />

			<H1>This page does exist.</H1>

			<P className='text-center'>
				It seems like you are lost. Let&apos;s go back{' '}
				<A href='/' className='underline underline-offset-2'>
					home
				</A>
				.
			</P>
		</PageWrapper>
	);
}
