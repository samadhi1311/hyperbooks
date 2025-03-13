import { Plan, Template } from '@/lib/types';
import { AzureTemplate, renderAzureTemplate } from './azure';
import { MidnightTemplate, renderMidnightTemplate } from './midnight';
import { QuietTemplate, renderQuietTemplate } from './quiet';

export type TemplateKey = 'azure' | 'midnight' | 'quiet';

const CUSTOMIZABLE_PLANS: Plan[] = ['pro', 'ultimate'];

export const canCustomizeTemplates = (plan?: Plan): boolean => {
	if (!plan) return false;
	return CUSTOMIZABLE_PLANS.includes(plan);
};

export const applyTemplateCustomization = (templateKey: TemplateKey, customization?: Template, userPlan?: Plan) => {
	// Only apply customizations for eligible plans
	if (!canCustomizeTemplates(userPlan) || !customization) {
		return {};
	}

	// Only apply customizations if they match the current template
	if (customization.templateKey !== templateKey) {
		return {};
	}

	// Return customization properties
	return {
		colors: customization.colors || {},
		font: customization.font || {},
	};
};

const templates = {
	azure: {
		component: AzureTemplate,
		render: renderAzureTemplate,
		title: 'Azure',
		description: 'A blue-themed bold design.',
		preview: '/template-data/previews/azure.png',
	},
	midnight: {
		component: MidnightTemplate,
		render: renderMidnightTemplate,
		title: 'Midnight',
		description: 'A minimal design with dark colors.',
		preview: '/template-data/previews/midnight.png',
	},
	quiet: {
		component: QuietTemplate,
		render: renderQuietTemplate,
		title: 'Quiet',
		description: 'A minimal design with light colors.',
		preview: '/template-data/previews/quiet.png',
	},
};

export default templates;
