'use client';

import { useTemplateStore } from '@/store/use-templates';
import templates, { TemplateKey } from '@/templates';
import { PageWrapper, Section } from '@/components/ui/layout';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';
import { H2, P } from '@/components/ui/typography';

export default function SelectTemplate() {
	const { selectedTemplate, setTemplate } = useTemplateStore();

	return (
		<PageWrapper>
			<Suspense fallback={<Loader />}>
				<Section>
					<H2>Browse templatea.</H2>
					<P variant='sm' className='mb-2 text-muted-foreground md:mb-4 lg:mb-6'>
						Your preferences will be saved locally.
					</P>
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
