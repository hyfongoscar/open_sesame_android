import React, { useEffect, useContext, useState, createContext } from 'react'

export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {

  const [themeColor, setThemeColor] = useState("purple")

  return (
    <ThemeContext.Provider
      value={{
        themeColor, setThemeColor
      }}>
      {children}
    </ThemeContext.Provider>
  )
  }
  
export default ThemeContextProvider
