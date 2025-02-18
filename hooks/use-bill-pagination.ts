import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useBillPaginationStore } from '@/store/use-bill-pagination';

interface UseBillsPaginationProps {
	userId: string;
	pageSize?: number;
}

const useBillsPagination = ({ userId, pageSize = 10 }: UseBillsPaginationProps) => {
	const { documents, setDocuments, currentPage, setCurrentPage, loading, setLoading, hasMore, setHasMore, setError } = useBillPaginationStore(); // Using store's state
	const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);

	useEffect(() => {
		fetchInitialData();
	}, [userId]);

	const fetchInitialData = async () => {
		if (!userId) return;

		try {
			setLoading(true);

			console.log('Calling bill pagination...');

			const collectionRef = collection(db, 'users', userId, 'bills');
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
			console.error('Error fetching bills:', err);
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	const fetchNextPage = async () => {
		if (!lastVisible || !hasMore || !userId) return;

		try {
			setLoading(true);
			console.log('Calling bill next pagination...');

			const collectionRef = collection(db, 'users', userId, 'bills');
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
			console.error('Error fetching next page of bills:', err);
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
		loading, // Use loading from store
		hasMore,
		currentPage,
		fetchNextPage,
		resetPagination,
	};
};

export default useBillsPagination;
