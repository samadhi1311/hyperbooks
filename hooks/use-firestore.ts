import { useState } from 'react';
import { doc, setDoc, addDoc, collection, WithFieldValue, DocumentData } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export const useFirestoreAdd = <T extends WithFieldValue<DocumentData>>() => {
	const { user } = useAuth();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const addDocument = async (data: T, customDocId?: string) => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to add a document.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const userCollectionRef = collection(db, user.uid);

			const docRef = customDocId ? await setDoc(doc(userCollectionRef, customDocId), data) : await addDoc(userCollectionRef, data);

			toast({
				variant: 'success',
				title: 'Document Added',
				description: 'Document successfully added to Firestore.',
			});

			return docRef;
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Adding Document',
				description: error.message,
			});
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { addDocument, loading, error };
};
