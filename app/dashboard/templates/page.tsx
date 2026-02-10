'use client';

import { useTemplateStore } from '@/store/use-templates';
import templates, { TemplateKey, PageSize } from '@/templates';
import { PageWrapper, Section } from '@/components/ui/layout';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';
import { H2, P } from '@/components/ui/typography';

export default function SelectTemplate() {
	const { selectedTemplate, selectedPageSize, setTemplate, setPageSize } = useTemplateStore();

	return (
		<PageWrapper>
			<Suspense fallback={<Loader />}>
				<Section>
					<H2>Browse templates.</H2>
					<P variant='sm' className='mb-2 text-muted-foreground md:mb-4 lg:mb-6'>
						Your preferences will be saved locally.
					</P>
					
					{/* Page Size Selection */}
					<div className='mb-6'>
						<P className='mb-3 font-medium'>Page Size</P>
						<div className='flex gap-2'>
							{(['A4', 'A5', 'A6'] as PageSize[]).map((size) => (
								<button
									key={size}
									onClick={() => setPageSize(size)}
									className={`
										px-4 py-2 rounded-md border-2 transition-all
										${selectedPageSize === size 
											? 'border-violet-500/50 bg-muted text-violet-700 dark:text-violet-300' 
											: 'border-border bg-background hover:bg-muted'
										}
									`}
								>
									{size}
								</button>
							))}
						</div>
					</div>

					<div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4'>
						{Object.entries(templates).map(([key, template]) => (
							<div
								key={key}
								onClick={() => setTemplate(key as TemplateKey)}
								className={`
                            cursor-pointer border-2 rounded-lg w-full overflow-hidden
                            ${selectedTemplate === key ? 'border-violet-500/50 bg-muted' : 'bg-background'}
                            hover:shadow-lg transition-all`}>
								<div className='p-2 md:p-4'>
									<P className='font-semibold'>{template.title}</P>
									<P variant='sm' className='text-muted-foreground'>
										{template.description}
									</P>
								</div>
								<div className='overflow-hidden rounded-sm p-2'>
									<img src={template.preview} alt={`${template.title} template preview`} className='aspect-auto w-full rounded-sm border border-border object-cover' />
								</div>
							</div>
						))}
					</div>
					<div className='my-4 flex w-full items-center justify-center py-4 text-center'>
						<p className='text-center text-xs text-muted-foreground'>You have reached the end of the list.</p>
					</div>
				</Section>
			</Suspense>
		</PageWrapper>
	);
}
