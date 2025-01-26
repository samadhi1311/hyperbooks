'use client';

import { useTemplateStore } from '@/store/use-templates';
import templates, { TemplateKey } from '@/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageWrapper, Section } from '@/components/ui/layout';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';

export default function SelectTemplate() {
	const { selectedTemplate, setTemplate } = useTemplateStore();

	return (
		<PageWrapper>
			<select value={selectedTemplate} onChange={(e) => setTemplate(e.target.value as TemplateKey)}>
				<option value='minimal'>Minimal</option>
				<option value='classic'>Classic</option>
			</select>

			<Suspense fallback={<Loader />}>
				<Section className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
					{Object.entries(templates).map(([key, template]) => (
						<Card
							key={key}
							onClick={() => setTemplate(key as TemplateKey)}
							className={`
                            cursor-pointer border-2 rounded-lg w-full 
                            ${selectedTemplate === key ? 'border-violet-500/50' : ''}
                            hover:shadow-lg transition-all`}>
							<CardHeader>
								<CardTitle>{template.title}</CardTitle>
								<CardDescription>{template.description}</CardDescription>
							</CardHeader>
							<CardContent className='p-0'>
								<img src={template.preview} alt={`${template.title} template preview`} className='aspect-[3/4] w-full object-cover' />
							</CardContent>
						</Card>
					))}
				</Section>
			</Suspense>
		</PageWrapper>
	);
}
