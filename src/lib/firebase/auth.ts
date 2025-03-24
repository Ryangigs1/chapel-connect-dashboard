
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp, 
  collection,
  addDoc, 
  updateDoc,
  query,
  orderBy,
  limit,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import { auth, db, storage } from "./index";
import { User } from "../auth/types";

// Convert Firebase user to our User type
export const formatUser = (user: FirebaseUser, additionalData?: any): User => {
  return {
    id: user.uid,
    name: user.displayName || "User",
    email: user.email || "",
    avatarUrl: user.photoURL || "/avatar-default.png",
    role: additionalData?.role || "user",
    providerData: user.providerData && user.providerData[0] ? user.providerData[0].providerId : "password",
    department: additionalData?.department || undefined,
    level: additionalData?.level || undefined
  };
};

// Update user profile data in Firestore
export const updateUserProfile = async (userId: string, data: { name?: string; email?: string }): Promise<void> => {
  try {
    // Update Firestore document
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    // If name is provided, also update the displayName in Firebase Auth
    if (data.name && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: data.name });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Google Sign In
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const { user } = userCredential;
    
    // Check if user document exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      const timestamp = new Date().toISOString();
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "User",
        role: "user",
        avatarUrl: user.photoURL || "/avatar-default.png",
        createdAt: timestamp,
        updatedAt: timestamp,
        lastLoginAt: timestamp,
        providerData: "google.com"
      });
    } else {
      // Update last login time
      await updateDoc(doc(db, "users", user.uid), {
        lastLoginAt: new Date().toISOString(),
        avatarUrl: user.photoURL, // Ensure avatar URL is updated
        name: user.displayName // Ensure name is updated
      });
    }
    
    const userData = userDoc.exists() ? userDoc.data() : null;
    return formatUser(user, userData);
  } catch (error: any) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Sign up a new user
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  name: string
): Promise<User> => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Update the user profile
    await updateProfile(user, {
      displayName: name,
      photoURL: "/avatar-default.png"
    });
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name,
      role: "user",
      avatarUrl: "/avatar-default.png",
      createdAt: timestamp,
      updatedAt: timestamp,
      providerData: "password"
    });
    
    // Send email verification
    try {
      await sendEmailVerification(user);
    } catch (error) {
      console.warn("Could not send verification email:", error);
    }
    
    return formatUser(user);
  } catch (error: any) {
    console.error("Error signing up with email and password", error);
    throw error;
  }
};

// Sign in an existing user
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    let userData: any = {};
    
    if (userDoc.exists()) {
      userData = userDoc.data();
      
      // Update the user's last login time
      await updateDoc(doc(db, "users", user.uid), {
        lastLoginAt: new Date().toISOString()
      });
    } else {
      // If user document doesn't exist in Firestore yet (rare case), create it
      userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "User",
        role: "user",
        avatarUrl: user.photoURL || "/avatar-default.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        providerData: "password"
      };
      
      await setDoc(doc(db, "users", user.uid), userData);
    }
    
    return formatUser(user, userData);
  } catch (error: any) {
    console.error("Error signing in with email and password", error);
    throw error;
  }
};

// Sign out the user
export const signOutUser = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error sending password reset email", error);
    throw error;
  }
};

// Add a comment to the comments collection
export const addComment = async (
  userId: string,
  content: string
): Promise<void> => {
  try {
    await addDoc(collection(db, "comments"), {
      userId,
      content,
      createdAt: new Date().toISOString(),
      likes: 0
    });
  } catch (error: any) {
    console.error("Error adding comment", error);
    throw error;
  }
};

// Get recent comments
export const getRecentComments = async (limitCount: number = 10): Promise<any[]> => {
  try {
    const commentsQuery = query(
      collection(db, "comments"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(commentsQuery);
    const comments: any[] = [];
    
    for (const docSnapshot of snapshot.docs) {
      const commentData = docSnapshot.data();
      // Create a proper document reference using userId from commentData
      const userDocRef = doc(db, "users", commentData.userId);
      const userDoc = await getDoc(userDocRef);
      
      comments.push({
        id: docSnapshot.id,
        ...commentData,
        user: userDoc.exists() ? userDoc.data() : { name: "Unknown User" }
      });
    }
    
    return comments;
  } catch (error: any) {
    console.error("Error getting comments", error);
    throw error;
  }
};
