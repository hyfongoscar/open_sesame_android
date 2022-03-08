import React, { useEffect, useLayoutEffect, useContext, useState, createContext } from 'react'
import firestore from '@react-native-firebase/firestore';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState([])
  const [font, setFont] = useState(20)
  const { user } = useContext(AccountAuthContext)

  const colorPairs = [
    { primary: "#D32F2F", secondary: "#EF9A9A"}, // "red" 
    { primary: "#D81B60", secondary: "#F48FB1"}, // "pink"
    { primary: "#9C27B0", secondary: "#CE93D8"}, // "purple"
    { primary: "#5E35B1", secondary: "#B39DDB"}, // "indigo"
    { primary: "#3949AB", secondary: "#9FA8DA"}, // "blue"
    // { primary: "#D32F2F", secondary: "#FFCDD2"}, // "cyan"
    // { primary: "#D32F2F", secondary: "#FFCDD2"}, // "teal"
    // { primary: "#D32F2F", secondary: "#FFCDD2"}, // "green"
    // { primary: "#D32F2F", secondary: "#FFCDD2"}, // "lime"
    // { primary: "#D32F2F", secondary: "#FFCDD2"}, // "yellow"
    // { primary: "#D32F2F", secondary: "#FFCDD2"}, // "orange"
    // { primary: "#D32F2F", secondary: "#FFCDD2"}, // "darkorange"
    // { primary: "#D32F2F", secondary: "#FFCDD2"}, // "brown"
    // { primary: "#D32F2F", secondary: "#FFCDD2"}, // "grey"
    // { primary: "#D32F2F", secondary: "#FFCDD2"}, // "bluegrey"
  ]

  const getSecondaryColor = (color) => {
    var secondaryColor
    colorPairs.forEach((colorPair) => {
      if (colorPair.primary == color) {
        secondaryColor = colorPair.secondary
        return
      }
    })
    return secondaryColor
  }


  useEffect(() => {
    if (user) {
      const subscriber = firestore()
        .collection('profiles')
        .doc(user.email)
        .onSnapshot(documentSnapshot => {
          setTheme({
              font: documentSnapshot.data().fontSize || 20,
              color: documentSnapshot.data().color || "#9C27B0",
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
              theme, setTheme,
              colorPairs, getSecondaryColor
            }}>
            {children}
        </ThemeContext.Provider>
    )
    }

export default ThemeContextProvider
