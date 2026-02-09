import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  type Timestamp
} from "firebase/firestore";

export interface Book {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
  location: string;
  cover?: string;
  createdAt?: Timestamp;
}

const COLLECTION_NAME = "books";

export const subscribeToBooks = (callback: (books: Book[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("title", "asc"));
  return onSnapshot(q, (snapshot) => {
    const books = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];
    callback(books);
  });
};

export const addBook = async (book: Omit<Book, "id">) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...book,
    available: book.copies, // Initially all copies are available
    createdAt: new Date(),
  });
};

export const updateBook = async (id: string, data: Partial<Book>) => {
  const bookRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(bookRef, data);
};

export const deleteBook = async (id: string) => {
  return await deleteDoc(doc(db, COLLECTION_NAME, id));
};
