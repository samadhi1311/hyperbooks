const PLAN_LIMITS = {
	starter: {
		invoicesPerMonth: 5,
		billsPerMonth: 5,
		exports: 20,
		branding: true,
		customTheme: false,
		dailyAnalytics: 30,
		ai: false,
	},
	pro: {
		invoicesPerMonth: 25,
		billsPerMonth: 25,
		exports: Infinity,
		branding: false,
		customTheme: true,
		dailyAnalytics: 90,
		ai: true,
	},
	ultimate: {
		invoicesPerMonth: 500,
		billsPerMonth: 500,
		exports: Infinity,
		branding: false,
		customTheme: true,
		dailyAnalytics: 365,
		ai: true,
	},
};

const starterPerks = [
	'Total of 10 records per month',
	'Select any free templates from the library',
	'20 invoice exports per month',
	'Daily analytics for the last 30 days.',
	'Monthly analytics for all time.',
	'hyperbooks branding.',
	'No AI Powered Insights.',
];

const proPerks = [
	'Total of 50 records per month',
	'Unlimited invoice exports',
	'Daily analytics for the last 90 days',
	'Monthly analytics for all time',
	'AI-Powered Insights',
	'Custom-made invoice template',
	'No hyperreal banding',
];

const ultimatePerks = [
	'Total of 1000 records per month',
	'Unlimited invoice exports',
	'Daily analytics for the last 365 days',
	'Monthly analytics for all time',
	'AI-Powered Insights',
	'Custom-made invoice template',
	'No hyperreal banding',
];

export { PLAN_LIMITS, starterPerks, proPerks, ultimatePerks };
