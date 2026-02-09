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

export interface Student {
  id?: string;
  matricula: string;
  name: string;
  email: string;
  career: string;
  status: "active" | "inactive";
  createdAt?: Timestamp;
}

const COLLECTION_NAME = "students";

export const subscribeToStudents = (callback: (students: Student[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
  return onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[];
    callback(students);
  });
};

export const addStudent = async (student: Omit<Student, "id">) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...student,
    status: "active",
    createdAt: new Date(),
  });
};

export const updateStudent = async (id: string, data: Partial<Student>) => {
  const studentRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(studentRef, data);
};

export const deleteStudent = async (id: string) => {
  // Soft delete typically better, but user asked for delete
  return await deleteDoc(doc(db, COLLECTION_NAME, id));
};
