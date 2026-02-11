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
  console.log("Fetching loans for studentId:", studentId);
  const q = query(
    collection(db, COLLECTION_NAME),
    where("studentId", "==", studentId)
  );
  const snapshot = await getDocs(q);
  console.log("Loans snapshot size:", snapshot.size);
  const loans = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Loan[];
  console.log("Mapped loans:", loans);

  // Sort client-side to avoid needing a composite index
  return loans.sort((a, b) => b.loanDate.localeCompare(a.loanDate));
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
