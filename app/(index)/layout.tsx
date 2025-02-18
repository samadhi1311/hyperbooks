import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
	title: 'hyperbooks. | Your Invoicing, Simplified.',
	description: 'Create, manage, and export professional invoices in seconds—anytime, anywhere.',
	keywords: [
		'hyperbooks',
		'invoice generator',
		'online invoice generator',
		'Sri Lanka',
		'Bookkeeping',
		'Taxation',
		'Accounting',
		'Accounting Software',
		'Accounting Software Sri Lanka',
		'Accounting Software in Sri Lanka',
		'Accounting Software for Sri Lanka',
	],
	authors: [
		{
			name: 'Samadhi Gunasinghe',
			url: 'https://hyperreal.cloud',
		},
		{
			name: 'Nipuni Gamage',
			url: 'https://hyperreal.cloud',
		},
	],
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		title: 'hyperbooks. | Your Invoicing, Simplified.',
		description: 'Create, manage, and export professional invoices in seconds—anytime, anywhere.',
		type: 'website',
		url: 'https://hyperbooks.hyperreal.cloud/',
		images: [
			{
				url: 'https://hyperbooks.hyperreal.cloud/meta-image.jpg',
			},
		],
	},
	twitter: {
		title: 'hyperbooks. | Your Invoicing, Simplified.',
		description: 'Create, manage, and export professional invoices in seconds—anytime, anywhere.',
		card: 'summary_large_image',
		site: '@hyperrealhq',
		images: ['https://hyperbooks.hyperreal.cloud/meta-image.jpg'],
	},
};

export default function IndexLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<Navigation />
			{children}
			<Footer />
		</>
	);
}
