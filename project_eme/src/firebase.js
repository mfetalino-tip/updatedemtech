import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import database from '@react-native-firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB8MpJnk6EC1ogJ-_vItDEZNF7sHFoTEso",
  authDomain: "lostandfound-52f41.firebaseapp.com",
  projectId: "lostandfound-52f41",
  storageBucket: "lostandfound-52f41.appspot.com",
  messagingSenderId: "768566881197",
  appId: "1:768566881197:web:0c7efa973ce67d0bc30f24"
};

export const app = initializeApp(firebaseConfig); 
export const authInstance = auth(app);
export const db = database(app);
export const createUser = createUserWithEmailAndPassword; // renamed for clarity
export const signInUser = signInWithEmailAndPassword; // renamed for clarity
export const updateUserProfile = updateProfile; // add this line
export const userSignOut = signOut; // add this line