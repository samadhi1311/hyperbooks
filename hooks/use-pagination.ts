import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { usePaginationStore } from '@/store/use-pagination';

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

	useEffect(() => {
		fetchInitialData();
	}, [userId]);

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
			setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
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

			// Avoid duplicates by using a Set
			const uniqueDocs = [...new Map([...documents, ...newDocs].map((doc) => [doc.id, doc])).values()];

			setDocuments(uniqueDocs);
			setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
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
