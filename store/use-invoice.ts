import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InvoiceData } from '@/lib/types';

interface InvoiceStore {
	invoiceData: InvoiceData;
	updateInvoiceData: (updates: Partial<InvoiceData>) => void;
	updateBilledToData: (updates: Partial<InvoiceData['billedTo']>) => void;
	updateItemData: (index: number, updates: Partial<InvoiceData['items'][0]>) => void;
	addItem: (item?: InvoiceData['items'][0]) => void;
	removeItem: (index: number) => void;
	resetInvoiceData: () => void;
}

const defaultInvoiceData: InvoiceData = {
	billedTo: {
		name: '',
		address: ['', '', ''],
		email: '',
		phone: '',
	},
	items: [],
	discount: 0,
	tax: 0,
	total: 0,
};

const calculateTotal = (invoiceData: InvoiceData) => {
	const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.amount || 0), 0);
	const discountAmount = invoiceData.discount !== undefined ? (subtotal * invoiceData.discount) / 100 : 0;
	const taxAmount = invoiceData.tax !== undefined ? ((subtotal - discountAmount) * invoiceData.tax) / 100 : 0;
	const total = subtotal - discountAmount + taxAmount;
	return parseFloat(total.toFixed(2));
};

export const useInvoiceStore = create<InvoiceStore>()(
	persist(
		(set) => ({
			invoiceData: defaultInvoiceData,

			updateInvoiceData: (updates) =>
				set((state) => {
					const updatedInvoice = { ...state.invoiceData, ...updates };
					return { invoiceData: { ...updatedInvoice, total: calculateTotal(updatedInvoice) } };
				}),

			updateBilledToData: (updates) =>
				set((state) => {
					const updatedInvoice = {
						...state.invoiceData,
						billedTo: { ...state.invoiceData.billedTo, ...updates },
					};
					return { invoiceData: { ...updatedInvoice, total: calculateTotal(updatedInvoice) } };
				}),

			updateItemData: (index, updates) =>
				set((state) => {
					const newItems = [...state.invoiceData.items];
					newItems[index] = { ...newItems[index], ...updates };
					const updatedInvoice = { ...state.invoiceData, items: newItems };
					return { invoiceData: { ...updatedInvoice, total: calculateTotal(updatedInvoice) } };
				}),

			addItem: (item = { description: '', quantity: undefined, amount: undefined }) =>
				set((state) => {
					const updatedInvoice = {
						...state.invoiceData,
						items: [...state.invoiceData.items, item],
					};
					return { invoiceData: { ...updatedInvoice, total: calculateTotal(updatedInvoice) } };
				}),

			removeItem: (index) =>
				set((state) => {
					const updatedInvoice = {
						...state.invoiceData,
						items: state.invoiceData.items.filter((_, i) => i !== index),
					};
					return { invoiceData: { ...updatedInvoice, total: calculateTotal(updatedInvoice) } };
				}),

			resetInvoiceData: () => set({ invoiceData: defaultInvoiceData }),
		}),
		{
			name: 'hyperbooks-invoice-storage',
			partialize: (state) => ({
				invoiceData: state.invoiceData,
			}),
		}
	)
);
