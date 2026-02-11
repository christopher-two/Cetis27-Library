import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export interface CustomField {
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  options?: string[]; // For 'select' type
  required: boolean;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  bannerUrl?: string; // Optional banner image URL
  startDate: Date;
  endDate: Date;
  location: string;
  capacity: number;
  registeredCount: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  rules: string[];
  requirements: string[];
  customFields: CustomField[];
  createdBy: string;
  createdAt: Date;
}

export interface Registration {
  id?: string;
  eventId: string;
  userId: string;
  userEmail: string;
  userName: string;
  registrationDate: Date;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  customData: Record<string, any>; // Answers to customFields
}

const EVENTS_COLLECTION = "events";
const REGISTRATIONS_COLLECTION = "registrations";

export const createEvent = async (eventData: Omit<Event, "id" | "createdAt" | "registeredCount">) => {
  const eventsRef = collection(db, EVENTS_COLLECTION);
  const docRef = await addDoc(eventsRef, {
    ...eventData,
    registeredCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateEvent = async (id: string, eventData: Partial<Event>) => {
  const eventRef = doc(db, EVENTS_COLLECTION, id);
  await updateDoc(eventRef, eventData);
};

export const deleteEvent = async (id: string) => {
  const eventRef = doc(db, EVENTS_COLLECTION, id);
  await deleteDoc(eventRef);
};

export const getEvents = async (statusFilter?: string) => {
  const eventsRef = collection(db, EVENTS_COLLECTION);
  let q = query(eventsRef, orderBy("startDate", "asc"));

  if (statusFilter) {
    q = query(q, where("status", "==", statusFilter));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startDate: doc.data().startDate?.toDate(),
    endDate: doc.data().endDate?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as Event[];
};

export const getEventById = async (id: string) => {
  const eventRef = doc(db, EVENTS_COLLECTION, id);
  const snapshot = await getDoc(eventRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    startDate: data.startDate?.toDate(),
    endDate: data.endDate?.toDate(),
    createdAt: data.createdAt?.toDate(),
  } as Event;
};

export const registerForEvent = async (
  eventId: string, 
  user: { uid: string; email: string; displayName: string }, 
  customData: Record<string, any>
) => {
  // Note: Optimistic update or transaction should be used in production to prevent overbooking.
  // For now, we'll do a simple check.
  const event = await getEventById(eventId);
  if (!event) throw new Error("Event not found");
  if (event.registeredCount >= event.capacity) throw new Error("Event is full");

  const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
  
  // Check if already registered
  const q = query(registrationsRef, where("eventId", "==", eventId), where("userId", "==", user.uid));
  const existing = await getDocs(q);
  if (!existing.empty) throw new Error("User already registered");

  const registrationData: Omit<Registration, "id"> = {
    eventId,
    userId: user.uid,
    userEmail: user.email,
    userName: user.displayName,
    registrationDate: new Date(), // Client side date for now, serverTimestamp ideally
    status: 'confirmed',
    customData
  };

  // Run as transaction to atomically increment count
  // NOT IMPLEMENTED: Simple addDoc for now to match interface speed. 
  // TODO: Refactor to transaction for consistency.
  
  const docRef = await addDoc(registrationsRef, {
      ...registrationData,
      registrationDate: serverTimestamp()
  });

  // Increment event registeredCount (unsafe without transaction, but functional for prototype)
  await updateEvent(eventId, { registeredCount: event.registeredCount + 1 });

  return docRef.id;
};

export const getUserRegistrations = async (userId: string) => {
  const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
  const q = query(registrationsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    registrationDate: doc.data().registrationDate?.toDate(),
  })) as Registration[];
};

export const getEventRegistrations = async (eventId: string) => {
  const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
  const q = query(
    registrationsRef,
    where("eventId", "==", eventId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    registrationDate: doc.data().registrationDate?.toDate(),
  })) as Registration[];
};
