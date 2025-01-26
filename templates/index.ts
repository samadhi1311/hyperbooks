import { ClassicTemplate, renderClassicTemplate } from './classic';
import { MinimalTemplate, renderMinimalTemplate } from './minimal';

export type TemplateKey = 'classic' | 'minimal';

const templates = {
	classic: {
		component: ClassicTemplate,
		render: renderClassicTemplate,
		title: 'Classic',
		description: 'The classic invoice template.',
		preview: '/bg-gradient.png',
	},
	minimal: {
		component: MinimalTemplate,
		render: renderMinimalTemplate,
		title: 'Minimal',
		description: 'The minimal invoice template.',
		preview: '/bg-gradient.png',
	},
};

export default templates;
