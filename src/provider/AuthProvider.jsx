import React, { createContext, useEffect, useState } from "react";

const provider = new GoogleAuthProvider();
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);

      // ✅ Notify the parent window
      if (window.opener) {
        window.opener.postMessage("auth_success", "*");
        setTimeout(() => window.close(), 500); // 🔥 Delay closing the window
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
      } else {
        // User is signed out
        // ...
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    signInWithGoogle,
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
