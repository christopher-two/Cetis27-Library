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
  limit,
  startAt,
  endAt,
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
  // ADVERTENCIA: Esto descarga TODOS los alumnos. Usar con precaución o solo para admins.
  const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"), limit(100)); // Limitamos por seguridad
  return onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[];
    callback(students);
  });
};

export const searchStudents = async (term: string): Promise<Student[]> => {
  if (!term || term.length < 2) return [];

  const lowerTerm = term.toLowerCase(); // Firestore filtra case-sensitive por defecto, idealmente guardar un campo normalizado
  // Esto es una búsqueda simplificada. Para producción ideal: Algolia, MeiliSearch o un campo "keywords" array.
  // Aquí usaremos una query simple por "name" (asumiendo que name está guardado como se busca, o usar startAt/endAt).
  
  // Nota: Firestore no soporta "contains" nativo de forma barata.
  // Usaremos startAt/endAt para búsqueda por prefijo en 'name' y 'matricula'.
  // Como 'name' y 'matricula' son campos distintos, requerimos 2 queries.
  
  const studentsRef = collection(db, COLLECTION_NAME);

  // Búsqueda por nombre (Prefijo)
  // Requerimos que 'name' esté indexado.
  // IMPORTANTE: Esto es case-sensitive. El usuario debe escribir "Juan" tal cual está en DB.
  // Para mejorar UX, guardaremos un campo 'name_lowercase' en el futuro.
  const nameQuery = query(
    studentsRef,
    orderBy("name"),
    startAt(term),
    endAt(term + "\uf8ff"),
    limit(5)
  );

  // Búsqueda por matrícula (Exacta o Prefijo)
  const matriculaQuery = query(
    studentsRef,
    orderBy("matricula"),
    startAt(term),
    endAt(term + "\uf8ff"),
    limit(5)
  );

  const [nameSnap, matriculaSnap] = await Promise.all([
    getDocs(nameQuery),
    getDocs(matriculaQuery)
  ]);

  const results = new Map<string, Student>();

  nameSnap.forEach((doc) => {
    results.set(doc.id, { id: doc.id, ...doc.data() } as Student);
  });

  matriculaSnap.forEach((doc) => {
    results.set(doc.id, { id: doc.id, ...doc.data() } as Student);
  });

  return Array.from(results.values());
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
