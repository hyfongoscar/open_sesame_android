import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export const AccountAuthContext = createContext();

const AccountAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      }
    })
    return subscriber
  }, [])

  const login = async (email, password) => {
    await auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .catch(error => {
        throw error
      })
  }

  const register = async (displayName, email, password) => {
    await auth()
      .createUserWithEmailAndPassword(email.trim(), password)
      .then(async (userCredential) => {
        const user = userCredential.user
        const profile = {
          displayName,
          photoURL: 'https://avatars.dicebear.com/api/avataaars/' + uuid.v4() + '.svg',
        }
        await user.updateProfile(profile)
        await firestore()
          .collection('profiles')
          .doc(email.trim())
          .set({
            uid: user.uid,
            color: '#9C27B0',
            fontSize: 20,
            backgroundURL: '',
            displayName,
            photoURL: 'https://avatars.dicebear.com/api/avataaars/' + uuid.v4() + '.svg',
          })
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

  
  const reset = async (email) => {
    await auth()
      .sendPasswordResetEmail(email)
      .then((user) => {
        alert('Please check your email to reset password')
      }).catch((e) => {
        console.log(e)
      })
  }

  return (
    <AccountAuthContext.Provider
      value={{
        user,
        login, register, logout, reset
      }}
    >
      {children}
    </AccountAuthContext.Provider>
  );
};

export default AccountAuthContextProvider
