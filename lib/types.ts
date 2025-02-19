import { Timestamp } from 'firebase/firestore';

type Plan = 'starter' | 'pro' | 'ultimate';

type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

type UserData = {
	id: string;
	name: string;
	email: string;
	currency?: string;

	totalIncome?: number;
	totalRevenue?: number;
	totalInvoiceCount?: number;
	totalOutstandingCount?: number;
	totalOutstandingAmount?: number;

	plan?: Plan;
	customer_id?: string;
	price_id?: string;
	product_id?: string;
	subscription_status?: SubscriptionStatus;
	scheduled_change?: Date;
	updated_at?: Date;
};

type InvoiceData = {
	id?: string;
	billedTo: {
		name: string;
		address?: string[];
		email?: string;
		phone?: string;
	};
	items: { description: string; quantity: number | undefined; amount: number | undefined }[];
	discount?: number;
	tax?: number;
	createdAt?: Timestamp;
	total: number;
	complete?: boolean;
};

type ProfileData = {
	name: string;
	email: string;
	phone: string;
	address?: string[];
	website?: string;
	logo?: string;
};

type BillData = {
	id?: string;
	description: string;
	category: string;
	amount: number;
	createdAt?: Timestamp;
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

export { type InvoiceData, type ProfileData, type UserData, type Plan, type SubscriptionStatus, type BillData, expenseCategories, placeholders, avatars };
