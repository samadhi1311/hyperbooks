import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { create } from 'zustand';

interface PaginationStore {
	documents: DocumentData[];
	setDocuments: (docs: DocumentData[]) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
}

const usePaginationStore = create<PaginationStore>((set) => ({
	documents: [],
	setDocuments: (docs) => set({ documents: docs }),
	currentPage: 1,
	setCurrentPage: (page) => set({ currentPage: page }),
}));

interface UseFirestorePaginationProps {
	userId: string;
	pageSize?: number;
}

const useFirestorePagination = ({ userId, pageSize = 10 }: UseFirestorePaginationProps) => {
	const { documents, setDocuments, currentPage, setCurrentPage } = usePaginationStore();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
	const [hasMore, setHasMore] = useState(true);

	const collectionPath = `users/${userId}/invoices`;

	// Initialize from session storage
	useEffect(() => {
		const sessionDocs = sessionStorage.getItem(`${collectionPath}-docs`);
		const sessionPage = sessionStorage.getItem(`${collectionPath}-page`);
		const sessionLastDoc = sessionStorage.getItem(`${collectionPath}-lastDoc`);

		if (sessionDocs && sessionPage && sessionLastDoc) {
			setDocuments(JSON.parse(sessionDocs));
			setCurrentPage(parseInt(sessionPage));
			setLastVisible(JSON.parse(sessionLastDoc));
		} else {
			// Initial fetch if no session data
			fetchInitialData();
		}
	}, [userId]); // Changed dependency to userId

	// Save to session storage whenever documents change
	useEffect(() => {
		if (documents.length > 0) {
			sessionStorage.setItem(`${collectionPath}-docs`, JSON.stringify(documents));
			sessionStorage.setItem(`${collectionPath}-page`, currentPage.toString());
			if (lastVisible) {
				sessionStorage.setItem(`${collectionPath}-lastDoc`, JSON.stringify(lastVisible));
			}
		}
	}, [documents, currentPage, lastVisible, collectionPath]);

	const fetchInitialData = async () => {
		if (!userId) return;

		try {
			setLoading(true);
			setError(null);

			const collectionRef = collection(db, 'users', userId, 'invoices');
			const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(pageSize));

			const querySnapshot = await getDocs(q);
			const docs = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setDocuments(docs);
			setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
			setHasMore(querySnapshot.docs.length === pageSize);
			setCurrentPage(1);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	const fetchNextPage = async () => {
		if (!lastVisible || !hasMore || !userId) return;

		try {
			setLoading(true);
			setError(null);

			const collectionRef = collection(db, 'users', userId, 'invoices');
			const q = query(collectionRef, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(pageSize));

			const querySnapshot = await getDocs(q);
			const newDocs = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setDocuments([...documents, ...newDocs]);
			setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
			setHasMore(querySnapshot.docs.length === pageSize);
			setCurrentPage(currentPage + 1);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	const resetPagination = () => {
		setDocuments([]);
		setLastVisible(null);
		setCurrentPage(1);
		setHasMore(true);
		sessionStorage.removeItem(`${collectionPath}-docs`);
		sessionStorage.removeItem(`${collectionPath}-page`);
		sessionStorage.removeItem(`${collectionPath}-lastDoc`);
		fetchInitialData();
	};

	return {
		documents,
		loading,
		error,
		hasMore,
		currentPage,
		fetchNextPage,
		resetPagination,
	};
};

export default useFirestorePagination;
