// type invoiceData = {
// 	company: {
// 		name: string;
// 		address: string[];
// 		email: string;
// 		phone: string;
// 		website: string;
// 	};

// 	biller: {
// 		name: string;
// 		address: string[];
// 		phone: string;
// 	};

// 	date: string;

// 	items: {
// 		name: string;
// 		quantity: number;
// 		price: number;
// 		total: number;
// 	}[];
// };

type InvoiceData = {
	company: {
		name: string;
		address: string[];
		email: string;
		phone: string;
		website: string;
		logo: string;
	};
};

type companyData = {
	name: string;
	address: string[];
	email: string;
	phone: string;
	website: string;
};

type billerData = {
	name: string;
	address: string[];
	phone: string;
};

type InvoiceItemsData = {
	items: {
		name: string;
		quantity: number;
		price: number;
		total: number;
	}[];
};

export { type InvoiceData, type companyData, type billerData, type InvoiceItemsData };
