type InvoiceData = {
	company: {
		name: string;
		address: string[];
		email: string;
		phone: string;
		website: string;
		logo: string;
	};
	items: { description: string; quantity: number | undefined; amount: number | undefined }[];
	discount: number;
	tax: number;
};

const placeholders = {
	company: {
		name: 'Company Name',
		address: ['Address Line 1', 'Address Line 2', 'City'],
		email: 'Company Email',
		phone: 'Phone number',
		website: 'Website',
	},
	item: {
		description: 'Item description',
		quantity: 'Quantity',
		amount: 'Price',
	},
};

export { type InvoiceData, placeholders };
