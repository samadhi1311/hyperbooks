import { DocumentData } from 'firebase/firestore';
import { create } from 'zustand';

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

export const useBillPaginationStore = create<BillPaginationStore>((set) => ({
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
}));
