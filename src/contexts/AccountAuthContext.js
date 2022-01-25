import React, { createContext, useEffect, useState, useReducer } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AccountAuthContext = createContext();

const AccountAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const reducer = (prevState, action) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          user: action.user,
          isLoading: false,
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          user: action.user,
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          user: null,
        };
    }
  }

  const initOptions = {
    isLoading: false,
    isSignout: true,
    user: null,
  }

  const [state, dispatch] = useReducer(reducer, initOptions)

  useEffect(async () => {
    var userToken
    try {
      // userToken = await SecureStore.getItemAsync('userToken')
    } catch (e) {
      // Restoring token failed
    }
    // After restoring token, we may need to validate it in production apps

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    dispatch({ type: 'RESTORE_TOKEN', user: userToken })
  }, []);

  const login = async (email, password) => {
    let obj = {}
    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        obj.success = true
        setUser(userCredential.user)
        dispatch({ type: 'SIGN_IN', user: 'dummy-auth-token' })
      })
      .catch(error => {
        obj.errorCode = error.code;
        obj.errorMessage = error.message;
      });
    return obj
  }

  const register = async (displayName, email, password) => {
    firestore()
        .collection('username')
        .doc(email)
        .set({
          name: displayName,
        })
        .then(() => {
          console.log('username registered');
        });
    let obj = {}
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        obj.success = true
        dispatch({ type: 'SIGN_IN', user: 'dummy-auth-token' });
      })
      .catch(error => {
        obj.errorCode = error.code;
        obj.errorMessage = error.message;
      });
    return obj
  }

  const logout = async () => {
    await auth()
      .signOut()
      .then(() => dispatch({ type: 'SIGN_OUT' }));
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
