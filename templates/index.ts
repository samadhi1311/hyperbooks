import { ClassicTemplate, renderClassicTemplate } from './classic';
import { MinimalTemplate, renderMinimalTemplate } from './minimal';

export type TemplateKey = 'classic' | 'minimal';

const templates = {
	classic: {
		component: ClassicTemplate,
		render: renderClassicTemplate,
	},
	minimal: {
		component: MinimalTemplate,
		render: renderMinimalTemplate,
	},
};

export default templates;
