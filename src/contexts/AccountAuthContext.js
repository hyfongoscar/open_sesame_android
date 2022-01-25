import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AccountAuthContext = createContext();

const AccountAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      }
    })
    return subscriber; // unsubscribe on unmount
  }, [])

  const login = async (email, password) => {
    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        setUser(userCredential.user)
      })
      .catch(error => {
        throw error
      })
  }

  const register = async (displayName, email, password) => {
    await firestore()
      .collection('username')
      .doc(email)
      .set({
        name: displayName,
      })
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(error => {
        throw error
      })
  }

  const logout = async () => {
    await auth()
      .signOut()
      .then(() => setUser(null));
  }

  return (
      <AccountAuthContext.Provider
          value={{
            user, loading,
            login, register, logout
          }}
      >
        {children}
      </AccountAuthContext.Provider>
  );
};

export default AccountAuthContextProvider
