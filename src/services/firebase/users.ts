import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  role: "admin" | "staff" | "viewer";
  createdAt: string;
}

export const createUserProfile = async (uid: string, email: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Default to admin for the first user/developer convenience in this context
    // In a stricter system, this would default to 'viewer' or require backend provisioning
    const newProfile: UserProfile = {
      uid,
      email,
      role: "admin", 
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  }
  
  return userSnap.data() as UserProfile;
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};
