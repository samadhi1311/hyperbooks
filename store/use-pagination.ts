import { DocumentData } from 'firebase/firestore';
import { create } from 'zustand';

interface PaginationStore {
	documents: DocumentData[];
	setDocuments: (docs: DocumentData[]) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	clearAllInvoices: () => void;
	loading: boolean;
	setLoading: (loading: boolean) => void; // New setter for loading state
}

export const usePaginationStore = create<PaginationStore>((set) => ({
	documents: [],
	setDocuments: (docs) => set({ documents: docs }),
	currentPage: 1,
	setCurrentPage: (page) => set({ currentPage: page }),
	clearAllInvoices: () => set({ documents: [], currentPage: 1 }),
	loading: false, // Default loading state
	setLoading: (loading) => set({ loading }), // Set loading state
}));
