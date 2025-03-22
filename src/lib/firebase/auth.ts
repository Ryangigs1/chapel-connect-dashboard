import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
  sendEmailVerification,
  sendPasswordResetEmail
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
    role: additionalData?.role || "user"
  };
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
      updatedAt: timestamp
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
        lastLoginAt: new Date().toISOString()
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

// Upload a profile picture for a user
export const uploadProfilePicture = async (
  userId: string, 
  file: File
): Promise<string> => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `users/${userId}/profile.jpg`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update user profile in Firebase Auth
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL
      });
      
      // Update user profile in Firestore
      await updateDoc(doc(db, "users", userId), {
        avatarUrl: downloadURL,
        updatedAt: new Date().toISOString()
      });
    }
    
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading profile picture", error);
    throw error;
  }
};

// Update user profile information
export const updateUserProfile = async (
  userId: string,
  data: {
    name?: string;
    email?: string;
    role?: string;
  }
): Promise<void> => {
  try {
    // Update the user document in Firestore
    await updateDoc(doc(db, "users", userId), {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    // Update profile in Firebase Auth if name is provided
    if (data.name && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.name
      });
    }
  } catch (error: any) {
    console.error("Error updating user profile", error);
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
    
    for (const doc of snapshot.docs) {
      const commentData = doc.data();
      // Fix: Use the userId from commentData to create a document reference
      const userDoc = await getDoc(doc(db, "users", commentData.userId));
      
      comments.push({
        id: doc.id,
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
