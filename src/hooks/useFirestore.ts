import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  QueryConstraint,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UseFirestoreOptions {
  collectionName: string;
  queryConstraints?: QueryConstraint[];
}

export function useFirestore<T = DocumentData>({ collectionName, queryConstraints = [] }: UseFirestoreOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...queryConstraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Erro ao buscar dados:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, queryConstraints]);

  const add = async (item: DocumentData) => {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, item);
      return docRef.id;
    } catch (err) {
      console.error('Erro ao adicionar documento:', err);
      throw err;
    }
  };

  const update = async (id: string, item: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, item as DocumentData);
    } catch (err) {
      console.error('Erro ao atualizar documento:', err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Erro ao remover documento:', err);
      throw err;
    }
  };

  return { data, loading, error, add, update, remove };
}
