import { Timestamp } from 'firebase/firestore';

type Tier = 'starter' | 'pro' | 'ultimate';

type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

type UserData = {
	id: string;
	name: string;
	planId: string;
	email: string;
	customerId?: string;
	tier?: Tier;
	priceId?: string;
	productId?: string;
	subscriptionStatus?: SubscriptionStatus;
	validUntil?: Date;
	totalIncome?: number;
	totalRevenue?: number;
	totalInvoiceCount?: number;
	totalOutstandingCount?: number;
	totalOutstandingAmount?: number;
	currency?: string;
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

export { type InvoiceData, type ProfileData, type UserData, type Tier, type SubscriptionStatus, placeholders, avatars };
