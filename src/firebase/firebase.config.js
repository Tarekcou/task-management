// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwWE5IuU3v4ipoSzekcqUxg33R_MByG9A",
  authDomain: "task-management-a8a54.firebaseapp.com",
  projectId: "task-management-a8a54",
  storageBucket: "task-management-a8a54.firebasestorage.app",
  messagingSenderId: "1027095467935",
  appId: "1:1027095467935:web:89daeb9fa16b5c0c858faa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
