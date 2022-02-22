import React, { useEffect, useLayoutEffect, useContext, useState, createContext } from 'react'
import firestore from '@react-native-firebase/firestore';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState([])
    const { user } = useContext(AccountAuthContext)

    useLayoutEffect(() => {
        if (user) {
          firestore()
            .collection('profiles')
            .doc(user.email)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    var tempTheme = []
                    const temp_font = documentSnapshot.data().fontSize
                    const temp_color = documentSnapshot.data().color
                    const temp_displayName = documentSnapshot.data().displayName
                    const temp_profile = documentSnapshot.data().photoURL
                    const temp_background = documentSnapshot.data().backgroundURL
                    tempTheme.push({
                        font: temp_font,
                        color: temp_color,
                        displayName: temp_displayName,
                        profile: temp_profile,
                        background: temp_background
                    })
                    setTheme(tempTheme)
                }
            })
        }
      })

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
