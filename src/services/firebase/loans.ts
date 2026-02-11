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
  where,
  getDocs,
  type Timestamp
} from "firebase/firestore";

export interface Loan {
  id?: string;
  bookId: string;
  bookTitle: string; // Denormalized for simpler UI
  studentId: string;
  studentName: string; // Denormalized
  loanDate: string; // ISO String YYYY-MM-DD
  dueDate: string;
  returnDate?: string;
  status: "active" | "returned" | "overdue" | "lost";
  createdAt?: Timestamp;
  notes?: string;
  returnCondition?: "good" | "damaged" | "lost";
}

const COLLECTION_NAME = "loans";

export const subscribeToLoans = (callback: (loans: Loan[]) => void) => {
  // In a real app, might want to filter or paginate
  const q = query(collection(db, COLLECTION_NAME), orderBy("loanDate", "desc"));
  return onSnapshot(q, (snapshot) => {
    const loans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Loan[];
    callback(loans);
  });
};

export const getLoansByStudent = async (studentId: string) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("studentId", "==", studentId),
    orderBy("loanDate", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Loan[];
};

export const addLoan = async (loan: Omit<Loan, "id">) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...loan,
    status: "active",
    createdAt: new Date(),
  });
};

export const updateLoan = async (id: string, data: Partial<Loan>) => {
  const loanRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(loanRef, data);
};

export const deleteLoan = async (id: string) => {
  return await deleteDoc(doc(db, COLLECTION_NAME, id));
};
