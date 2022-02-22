import React, { useEffect, useLayoutEffect, useContext, useState, createContext } from 'react'
import firestore from '@react-native-firebase/firestore';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState([])
  const [font, setFont] = useState(20)
  const { user } = useContext(AccountAuthContext)

  useEffect(() => {
    if (user) {
      const subscriber = firestore()
        .collection('profiles')
        .doc(user.email)
        .onSnapshot(documentSnapshot => {
          setTheme({
              font: documentSnapshot.data().fontSize || 20,
              color: documentSnapshot.data().color || "purple",
              displayName: documentSnapshot.data().displayName || "User",
              profile: documentSnapshot.data().photoURL,
              background: documentSnapshot.data().backgroundURL
          })
      })

      return () => subscriber();
    }
  }, [user])

    return (
        <ThemeContext.Provider
            value={{
                theme,setTheme
            }}>
            {children}
        </ThemeContext.Provider>
    )
    }

export default ThemeContextProvider
