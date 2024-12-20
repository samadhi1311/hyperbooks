'use client';

import { A, H2, P } from './ui/typography';

export default function Footer() {
	const MenuItem = ({ title, url }: { title: string; url: string }) => {
		return (
			<li>
				<A href={url}>
					<P>{title}</P>
				</A>
			</li>
		);
	};

	return (
		<div className='relative h-[60vh]' style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
			<div className='relative -top-[100vh] h-[calc(100vh+60vh)]'>
				<div className='sticky top-[calc(100vh-60vh)] h-[60vh]'>
					<footer className='relative z-30 flex h-full w-full flex-col items-center justify-between pb-8 pt-16'>
						<div>
							<H2>hyperbooks.</H2>
						</div>

						<div className='mx-auto grid w-full max-w-lg grid-cols-2 md:gap-16'>
							<div className='space-y-4'>
								<P variant='sm' className='text-muted-foreground'>
									Main Links
								</P>

								<ul className='list-none space-y-4'>
									<MenuItem title='Home' url='/' />
									<MenuItem title='Features' url='/#features' />
									<MenuItem title='Pricing' url='/#pricing' />
									<MenuItem title='Templates' url='/templates' />
								</ul>
							</div>

							<div className='space-y-4'>
								<P variant='sm' className='text-muted-foreground'>
									Important Links
								</P>

								<ul className='list-none space-y-4'>
									<MenuItem title='About' url='/about' />
									<MenuItem title='Contact' url='/contact' />
									<MenuItem title='Privacy Policy' url='/privacy-policy' />
									<MenuItem title='Terms and Conditions' url='/terms-and-conditions' />
								</ul>
							</div>
						</div>

						<div className='text-muted-foreground'>
							<P>
								&copy; 2024{' '}
								<A
									href='https://hyperreal.cloud'
									className='bg-gradient-to-tr from-violet-700 to-orange-400 bg-clip-text font-medium text-transparent dark:from-violet-600 dark:to-orange-500'>
									hyperreal
								</A>
								, All Rights Reserved.
							</P>
						</div>
					</footer>
				</div>
			</div>
		</div>
	);
}
