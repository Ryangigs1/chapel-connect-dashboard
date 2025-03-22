
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./index";
import { User } from "../auth/types";

// Convert Firebase user to our User type
export const formatUser = (user: FirebaseUser): User => {
  return {
    id: user.uid,
    name: user.displayName || "User",
    email: user.email || "",
    avatarUrl: user.photoURL || "/avatar-default.png",
    role: "user"
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
    
    // Use current timestamp from the client since serverTimestamp might cause issues
    const timestamp = new Date().toISOString();
    
    // Store additional user data in Firestore with proper permissions
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name,
      role: "user",
      avatarUrl: "/avatar-default.png",
      createdAt: timestamp,
      updatedAt: timestamp
    });
    
    return formatUser(user);
  } catch (error: any) {
    console.error("Error signing up with email and password", error);
    throw error; // Pass the error up to be handled by the caller
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
    
    if (userDoc.exists()) {
      // If we have additional data in Firestore, we can use it
      const userData = userDoc.data();
      
      // If user doesn't have a profile picture, set default
      if (!user.photoURL) {
        await updateProfile(user, {
          photoURL: userData.avatarUrl || "/avatar-default.png"
        });
      }
      
      // Update the user's last login time
      await setDoc(doc(db, "users", user.uid), {
        lastLoginAt: new Date().toISOString()
      }, { merge: true });
    }
    
    return formatUser(user);
  } catch (error: any) {
    console.error("Error signing in with email and password", error);
    throw error; // Pass the error up to be handled by the caller
  }
};

// Sign out the user
export const signOutUser = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Error signing out", error);
    throw error; // Pass the error up to be handled by the caller
  }
};

// Upload a profile picture for a user
export const uploadProfilePicture = async (
  userId: string, 
  file: File
): Promise<string> => {
  try {
    const storageRef = ref(storage, `users/${userId}/profile.jpg`);
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update user profile
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL
      });
      
      // Update in Firestore
      await setDoc(doc(db, "users", userId), {
        avatarUrl: downloadURL,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading profile picture", error);
    throw error; // Pass the error up to be handled by the caller
  }
};
