import { DocumentData } from 'firebase/firestore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BillPaginationStore {
	documents: DocumentData[];
	setDocuments: (docs: DocumentData[]) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	hasMore: boolean;
	setHasMore: (hasMore: boolean) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	error: string | null;
	setError: (error: string | null) => void;
	clearAllBills: () => void;
}

export const useBillPaginationStore = create<BillPaginationStore>()(
	persist(
		(set) => ({
			documents: [],
			setDocuments: (docs) => set({ documents: docs }),
			currentPage: 1,
			setCurrentPage: (page: number) => set({ currentPage: page }),
			hasMore: true,
			setHasMore: (hasMore: boolean) => set({ hasMore }),
			loading: false,
			setLoading: (loading: boolean) => set({ loading }),
			error: null,
			setError: (error: string | null) => set({ error }),
			clearAllBills: () => set({ documents: [], currentPage: 1, hasMore: true, loading: false, error: null }),
		}),
		{
			name: 'hyperbooks-bill-pagination-storage',
			storage: {
				getItem: (key) => {
					const value = sessionStorage.getItem(key);
					return value ? JSON.parse(value) : null;
				},
				setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
				removeItem: (key) => sessionStorage.removeItem(key),
			},
		}
	)
);
