import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InvoiceData } from '@/lib/types';

interface InvoiceStore {
	invoiceData: InvoiceData;
	updateInvoiceData: (updates: Partial<InvoiceData>) => void;
	updateCompanyData: (updates: Partial<InvoiceData['company']>) => void;
	updateItemData: (index: number, updates: Partial<InvoiceData['items'][0]>) => void;
	addItem: (item?: InvoiceData['items'][0]) => void;
	removeItem: (index: number) => void;
	resetInvoiceData: () => void;
}

const defaultInvoiceData: InvoiceData = {
	company: {
		name: '',
		address: ['', '', ''],
		email: '',
		phone: '',
		website: '',
		logo: '/bg-gradient.png',
	},
	items: [],
	discount: 0,
	tax: 0,
};

export const useInvoiceStore = create<InvoiceStore>()(
	persist(
		(set) => ({
			invoiceData: defaultInvoiceData,

			updateInvoiceData: (updates) =>
				set((state) => ({
					invoiceData: { ...state.invoiceData, ...updates },
				})),

			updateCompanyData: (updates) =>
				set((state) => ({
					invoiceData: {
						...state.invoiceData,
						company: { ...state.invoiceData.company, ...updates },
					},
				})),

			updateItemData: (index, updates) =>
				set((state) => {
					const newItems = [...state.invoiceData.items];
					newItems[index] = { ...newItems[index], ...updates };
					return {
						invoiceData: {
							...state.invoiceData,
							items: newItems,
						},
					};
				}),

			addItem: (item = { description: '', quantity: undefined, amount: undefined }) =>
				set((state) => ({
					invoiceData: {
						...state.invoiceData,
						items: [...state.invoiceData.items, item],
					},
				})),

			removeItem: (index) =>
				set((state) => ({
					invoiceData: {
						...state.invoiceData,
						items: state.invoiceData.items.filter((_, i) => i !== index),
					},
				})),

			// New reset method
			resetInvoiceData: () => set({ invoiceData: defaultInvoiceData }),
		}),
		{
			name: 'invoice-storage',
			partialize: (state) => ({
				invoiceData: state.invoiceData,
			}),
		}
	)
);
