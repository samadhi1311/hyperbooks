import { DocumentData } from 'firebase/firestore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PaginationStore {
	documents: DocumentData[];
	setDocuments: (docs: DocumentData[]) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	clearAllInvoices: () => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
}

export const usePaginationStore = create<PaginationStore>()(
	persist(
		(set) => ({
			documents: [],
			setDocuments: (docs) => set({ documents: docs }),
			currentPage: 1,
			setCurrentPage: (page) => set({ currentPage: page }),
			clearAllInvoices: () => set({ documents: [], currentPage: 1 }),
			loading: false,
			setLoading: (loading) => set({ loading }),
		}),
		{
			name: 'hyperbooks-invoice-pagination-storage',
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
