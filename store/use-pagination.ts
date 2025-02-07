import { DocumentData } from 'firebase/firestore';
import { create } from 'zustand';

interface PaginationStore {
	documents: DocumentData[];
	setDocuments: (docs: DocumentData[]) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
}

export const usePaginationStore = create<PaginationStore>((set) => ({
	documents: [],
	setDocuments: (docs) => set({ documents: docs }),
	currentPage: 1,
	setCurrentPage: (page) => set({ currentPage: page }),
}));
