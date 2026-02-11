import { Timestamp } from 'firebase/firestore';

type Plan = 'starter' | 'pro' | 'ultimate';

type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

type UserData = {
	id: string;
	name: string;
	email: string;
	currency?: string;

	plan?: Plan;
	customer_id?: string;
	price_id?: string;
	product_id?: string;
	subscription_status?: SubscriptionStatus;
	scheduled_change?: Date;
	customer_email?: string;
	updated_at?: Date;

	template?: string;
};

type AdditionalCharge = {
	description: string;
	amount: number;
	type: 'income' | 'expense';
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
	additionalCharges?: AdditionalCharge[];
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

type Template = {
	templateKey: string;
	colors?: {
		foreground?: string;
		background?: string;
		backgroundMuted?: string;
        foregroundMuted?: string;
        border?: string;
	};
	font?: {
		regular?: string;
		bold?: string;
	};
};

export { type InvoiceData, type ProfileData, type UserData, type Plan, type SubscriptionStatus, type BillData, type Template, type AdditionalCharge };
