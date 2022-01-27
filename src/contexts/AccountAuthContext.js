import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage'

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
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user
        const profile = {
          displayName,
          photoURL: 'https://my-cdn.com/assets/user/123.png',
        }
        await user.updateProfile(profile)
        await firestore()
          .collection('profiles')
          .doc(email)
          .set({
            id: user.uid,
            displayName,
            // photo:
          })
        setUser(userCredential.user)
      })

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
