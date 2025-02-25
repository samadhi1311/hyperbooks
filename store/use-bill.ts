import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BillData } from '@/lib/types';

interface BillStore {
	bill: BillData | null;
	setBill: (bill: BillData) => void;
	clearBill: () => void;
}

export const useBillStore = create<BillStore>()(
	persist(
		(set) => ({
			bill: null,
			setBill: (bill) => set({ bill }),
			clearBill: () => set({ bill: null }),
		}),
		{
			name: 'hyperbooks-bill-storage',
			storage: {
				getItem: (key) => {
					const value = sessionStorage.getItem(key);
					return value ? JSON.parse(value) : null;
				},
				setItem: (key, value) => {
					sessionStorage.setItem(key, JSON.stringify(value));
				},
				removeItem: (key) => {
					sessionStorage.removeItem(key);
				},
			},
		}
	)
);
