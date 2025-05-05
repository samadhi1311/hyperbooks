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

const expenseCategories = [
	{ label: 'Rent & Utilities', value: 'rent_utilities', description: 'Office rent, electricity, internet, water, phone bills' },
	{ label: 'Office Supplies & Equipment', value: 'office_supplies_equipment', description: 'Stationery, furniture, laptops, printers' },
	{ label: 'Software & Subscriptions', value: 'software_subscriptions', description: 'SaaS tools, cloud storage, email services' },
	{ label: 'Marketing & Advertising', value: 'marketing_advertising', description: 'Social media ads, SEO, branding' },
	{ label: 'Travel & Transportation', value: 'travel_transportation', description: 'Business trips, fuel, ride-sharing, hotels' },
	{ label: 'Employee & Contractor Costs', value: 'employee_contractor_costs', description: 'Salaries, freelancer payments, benefits' },
	{ label: 'Financial & Bank Fees', value: 'financial_bank_fees', description: 'Transaction fees, loan interest, currency exchange' },
	{ label: 'Taxes & Compliance', value: 'taxes_compliance', description: 'Income tax, sales tax, business registration' },
	{ label: 'Client & Business Development', value: 'client_business_development', description: 'Client dinners, networking events, gifts' },
	{ label: 'Insurance', value: 'insurance', description: 'Business insurance, health insurance, equipment coverage' },
	{ label: 'Other', value: 'other', description: 'Any other expenses' },
];

const placeholders = {
	company: {
		name: 'Company Name',
		address: ['Address Line 1', 'Address Line 2', 'City'],
		email: 'Company Email',
		phone: 'Phone number',
		website: 'Website',
	},
	billedTo: {
		name: 'Recipient Name',
		address: ['Address Line 1', 'Address Line 2', 'City'],
		email: 'Recipient Email',
		phone: 'Phone number',
	},
	item: {
		description: 'Item description',
		quantity: 'Quantity',
		amount: 'Price',
	},
	tax: 'Tax',
	discount: 'Discount',
};

const avatars = [
	{ id: 1, url: '/avatars/microbe-1.svg' },
	{ id: 2, url: '/avatars/microbe-2.svg' },
	{ id: 3, url: '/avatars/microbe-3.svg' },
	{ id: 4, url: '/avatars/microbe-4.svg' },
	{ id: 5, url: '/avatars/microbe-5.svg' },
	{ id: 6, url: '/avatars/microbe-6.svg' },
];

const starterPerks = [
	'Total of 10 records per month',
	'Select any free templates from the library',
	'20 invoice exports per month',
	'Daily analytics for the last 30 days.',
	'Monthly analytics for all time.',
	'Includes hyperbooks branding.',
	'No AI Powered Insights.',
];

const proPerks = [
	'Total of 50 records per month',
	'Unlimited invoice exports',
	'Daily analytics for the last 90 days',
	'Monthly analytics for all time',
	'AI-Powered Insights',
	'Customize invoice templates',
	'No hyperreal branding',
];

const ultimatePerks = [
	'Total of 1000 records per month',
	'Unlimited invoice exports',
	'Daily analytics for the last 365 days',
	'Monthly analytics for all time',
	'AI-Powered Insights',
	'Customize invoice templates',
	'No hyperreal branding',
];

export { PLAN_LIMITS, starterPerks, proPerks, ultimatePerks, avatars, placeholders, expenseCategories };
