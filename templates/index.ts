import { Plan, Template } from '@/lib/types';
import { AzureTemplate, renderAzureTemplate } from './azure';
import { MidnightTemplate, renderMidnightTemplate } from './midnight';
import { QuietTemplate, renderQuietTemplate } from './quiet';
import { EtherealTemplate, renderEtherealTemplate } from './ethereal';

export type TemplateKey = 'azure' | 'midnight' | 'quiet' | 'ethereal';
export type PageSize = 'A4' | 'A5' | 'A6';

export interface PageSizeConfig {
	fontSize: {
		page: string;
		header: string;
		profileMain: string;
		profileSecondary: string;
		billedMain: string;
		billedSecondary: string;
		invoiceRef: string;
		heading: string;
		items: string;
		trow: string;
		itemdesc: string;
		itemqty: string;
		itemunit: string;
		itemtotal: string;
		headdesc: string;
		headqty: string;
		headunit: string;
		headtotal: string;
		button: string;
		icon: string;
		footer: string;
		totalsText: string;
		totalsTextMain: string;
	};
	lineHeight: {
		trow: string;
	};
	spacing: {
		pagePadding: string;
		headerPadding: string;
		headerGap: string;
		gap: string;
		marginTop: string;
		logoSize: string;
		itemsGap: string;
		totalGap: string;
		footerPadding: string;
		itemsMarginTop: string;
		itemsMarginBottom: string;
		tbodyMarginTop: string;
		profileMarginLeft: string;
		profileGap: string;
		billedToGap: string;
		billedFieldGap: string;
		totalColumnGap: string;
		addButtonMargin: string;
		invoiceRefTop: string;
		invoiceRefLeft: string;
		invoiceRefRight: string;
		invoiceRefMarginTop: string;
	};
	layout: {
		billedToDirection: 'row' | 'column';
	};
}

const PAGE_SIZE_CONFIGS: Record<PageSize, PageSizeConfig> = {
	A4: {
		fontSize: {
			page: '10pt',
			header: '12pt',
			profileMain: '12pt',
			profileSecondary: '10pt',
			billedMain: '10pt',
			billedSecondary: '10pt',
			invoiceRef: '10pt',
			heading: '8pt',
			items: '10pt',
			trow: '10pt',
			itemdesc: '10pt',
			itemqty: '10pt',
			itemunit: '10pt',
			itemtotal: '10pt',
			headdesc: '8pt',
			headqty: '8pt',
			headunit: '8pt',
			headtotal: '8pt',
			button: '10pt',
			icon: '14pt',
			footer: '10pt',
			totalsText: '12pt',
			totalsTextMain: '14pt',
		},
		lineHeight: {
			trow: '24pt',
		},
		spacing: {
			pagePadding: '12pt',
			headerPadding: '12pt',
			headerGap: '0pt',
			gap: '12pt',
			marginTop: '12pt',
			logoSize: '96pt',
			itemsGap: '3pt',
			totalGap: '24pt',
			footerPadding: '12pt',
			itemsMarginTop: '32pt',
			itemsMarginBottom: '16pt',
			tbodyMarginTop: '8pt',
			profileMarginLeft: '16pt',
			profileGap: '2pt',
			billedToGap: '2pt',
			billedFieldGap: '8pt',
			totalColumnGap: '8pt',
			addButtonMargin: '16pt',
			invoiceRefTop: '16pt',
			invoiceRefLeft: 'auto',
			invoiceRefRight: '0pt',
			invoiceRefMarginTop: '-12pt',
		},
		layout: {
			billedToDirection: 'row',
		},
	},
	A5: {
		fontSize: {
			page: '8pt',
			header: '12pt',
			profileMain: '12pt',
			profileSecondary: '10pt',
			billedMain: '10pt',
			billedSecondary: '10pt',
			invoiceRef: '8pt',
			heading: '8pt',
			items: '8pt',
			trow: '8pt',
			itemdesc: '9pt',
			itemqty: '9pt',
			itemunit: '9pt',
			itemtotal: '9pt',
			headdesc: '8pt',
			headqty: '8pt',
			headunit: '8pt',
			headtotal: '8pt',
			button: '10pt',
			icon: '10pt',
			footer: '6pt',
			totalsText: '9pt',
			totalsTextMain: '9pt',
		},
		lineHeight: {
			trow: '18pt',
		},
		spacing: {
			pagePadding: '10pt',
			headerPadding: '10pt',
			headerGap: '0pt',
			gap: '10pt',
			marginTop: '10pt',
			logoSize: '72pt',
			itemsGap: '3pt',
			totalGap: '24pt',
			footerPadding: '8pt',
			itemsMarginTop: '32pt',
			itemsMarginBottom: '16pt',
			tbodyMarginTop: '6pt',
			profileMarginLeft: '8pt',
			profileGap: '2pt',
			billedToGap: '2pt',
			billedFieldGap: '8pt',
			totalColumnGap: '8pt',
			addButtonMargin: '16pt',
			invoiceRefTop: '10pt',
			invoiceRefLeft: 'auto',
			invoiceRefRight: '0pt',
			invoiceRefMarginTop: '-10pt',
		},
		layout: {
			billedToDirection: 'row',
		},
	},
	A6: {
		fontSize: {
			page: '6pt',
			header: '8pt',
			profileMain: '9pt',
			profileSecondary: '8pt',
			billedMain: '8pt',
			billedSecondary: '8pt',
			invoiceRef: '6pt',
			heading: '6pt',
			items: '6pt',
			trow: '6pt',
			itemdesc: '6pt',
			itemqty: '6pt',
			itemunit: '6pt',
			itemtotal: '6pt',
			headdesc: '6pt',
			headqty: '6pt',
			headunit: '6pt',
			headtotal: '6pt',
			button: '8pt',
			icon: '8pt',
			footer: '6pt',
			totalsText: '6pt',
			totalsTextMain: '6pt',
		},
		lineHeight: {
			trow: '12pt',
		},
		spacing: {
			pagePadding: '6pt',
			headerPadding: '8pt',
			headerGap: '0pt',
			gap: '2pt',
			marginTop: '6pt',
			logoSize: '48pt',
			itemsGap: '2pt',
			totalGap: '8pt',
			footerPadding: '6pt',
			itemsMarginTop: '10pt',
			itemsMarginBottom: '4pt',
			tbodyMarginTop: '4pt',
			profileMarginLeft: '6pt',
			profileGap: '2pt',
			billedToGap: '2pt',
			billedFieldGap: '6pt',
			totalColumnGap: '6pt',
			addButtonMargin: '12pt',
			invoiceRefTop: '8pt',
			invoiceRefLeft: 'auto',
			invoiceRefRight: '0pt',
			invoiceRefMarginTop: '-8pt',
		},
		layout: {
			billedToDirection: 'row',
		},
	},
};

export const getPageSizeConfig = (pageSize: PageSize): PageSizeConfig => {
	return PAGE_SIZE_CONFIGS[pageSize];
};

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
        defaultColors: {
            foreground: '#000000',
            background: '#ffffff',
            foregroundMuted: '#ffffff',
            backgroundMuted: '#458cd1',
            border: '#C4C4C4',
        },
    },
    midnight: {
        component: MidnightTemplate,
        render: renderMidnightTemplate,
        title: 'Midnight',
        description: 'A minimal design with dark colors.',
        preview: '/template-data/previews/midnight.png',
        defaultColors: {
            foreground: '#f5f5f5',
            background: '#151515',
            foregroundMuted: '#afafaf',
            backgroundMuted: '#252525',
            border: '#424242',
        },
    },
    quiet: {
        component: QuietTemplate,
        render: renderQuietTemplate,
        title: 'Quiet',
        description: 'A minimal design with light colors.',
        preview: '/template-data/previews/quiet.png',
        defaultColors: {
            foreground: '#252525',
            background: '#ffffff',
            foregroundMuted: '#5c5c5c',
            backgroundMuted: '#F2F2F2',
            border: '#A5A5A5',
        },
    },
    ethereal: {
        component: EtherealTemplate,
        render: renderEtherealTemplate,
        title: 'Ethereal',
        description: 'A minimal design using beige colors.',
        preview: '/template-data/previews/ethereal.png',
        defaultColors: {
            foreground: '#494036',
            background: '#F1EDE8',
            foregroundMuted: '#FFFFFF',
            backgroundMuted: '#9B8A79',
            border: '#BDA792',
        }
    }
};

export default templates;
