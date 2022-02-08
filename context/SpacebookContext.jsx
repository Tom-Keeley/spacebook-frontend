import React, { createContext, useEffect, useState } from 'react'

export const SpaceBookContext = createContext()

export default function SpaceBookContextProvider ({children}) {
  const [token, setToken] = useState('')

  useEffect(() => {
    console.log("TOKEN")
    console.log(token)
  }, [token])

  return (
    <SpaceBookContext.Provider value={{
      token,
      setToken
    }}>
      {children}
    </SpaceBookContext.Provider>
  )
}
