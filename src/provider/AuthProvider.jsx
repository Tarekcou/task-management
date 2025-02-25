import React, { createContext, useEffect, useState } from "react";

const provider = new GoogleAuthProvider();
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const gooleSignIn = () => {
    return signInWithPopup(auth, provider);
  };
  const logOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        // console.log(user);
        setUser(user);
        setLoading(false);
      } else {
        // User is signed out
        // ...
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    gooleSignIn,
    user,
    setUser,
    isLoading,
    logOut,
    setLoading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
