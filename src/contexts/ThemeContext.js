import React, { useEffect, useLayoutEffect, useContext, useState, createContext } from 'react'
import firestore from '@react-native-firebase/firestore';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState([])
  const { user } = useContext(AccountAuthContext)

  const colorPairs = [
    { primary: "#D32F2F", secondary: "#EF9A9A"}, // 1 "red" 
    { primary: "#D81B60", secondary: "#FF4081"}, // 2 "pink"
    { primary: "#9C27B0", secondary: "#E040FB"}, // 3 "purple"
    { primary: "#3F51B5", secondary: "#536DFE"}, // 4 "indigo"
    { primary: "#1976D2", secondary: "#2979FF"}, // 5 "blue"
    { primary: "#006064", secondary: "#00B8D4"}, // 6 "cyan"
    { primary: "#00796B", secondary: "#64FFDA"}, // 7 "teal"
    { primary: "#2E7D32", secondary: "#00C853"}, // 8 "green"
    { primary: "#AFB42B", secondary: "#AEEA00"}, // 9 "lime"
    { primary: "#FBC02D", secondary: "#FFD600"}, // 10 "yellow"
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
          if (!documentSnapshot.data()) {
            setTheme({
              font: 20,
              color: "#9C27B0",
              displayName: "User",
              photoURL: "",
              background: ""
            })
          } else {
            setTheme({
              font: documentSnapshot.data().fontSize || 20,
              color: documentSnapshot.data().color || "#9C27B0",
              displayName: documentSnapshot.data().displayName || "User",
              photoURL: documentSnapshot.data().photoURL,
              background: documentSnapshot.data().backgroundURL
            })
          }
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
