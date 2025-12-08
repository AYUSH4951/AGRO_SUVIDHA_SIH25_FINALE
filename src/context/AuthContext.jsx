// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, setAuthPersistence } from "../../firebase/firebaseConfig";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // optional: call this before signIn to set persistence
  async function setPersistenceForRemember(remember) {
    return setAuthPersistence(remember);
  }

  function signup(email, password, displayName) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        if (displayName) {
          return updateProfile(cred.user, { displayName }).then(() => cred);
        }
        return cred;
      });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    setPersistenceForRemember,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
