import { AzureTemplate, renderAzureTemplate } from './azure';
import { MidnightTemplate, renderMidnightTemplate } from './midnight';
import { QuietTemplate, renderQuietTemplate } from './quiet';

export type TemplateKey = 'azure' | 'midnight' | 'quiet';

const templates = {
	azure: {
		component: AzureTemplate,
		render: renderAzureTemplate,
		title: 'Azure',
		description: 'A blue-themed bold design.',
		preview: '/bg-gradient.png',
	},
	quiet: {
		component: QuietTemplate,
		render: renderQuietTemplate,
		title: 'Quiet',
		description: 'A minimal design with light colors.',
		preview: '/bg-gradient.png',
	},
	midnight: {
		component: MidnightTemplate,
		render: renderMidnightTemplate,
		title: 'Midnight',
		description: 'A minimal design with dark colors.',
		preview: '/bg-gradient.png',
	},
};

export default templates;
