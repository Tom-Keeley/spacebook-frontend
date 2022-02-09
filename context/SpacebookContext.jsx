import React, { createContext, useEffect, useState } from 'react'

export const SpaceBookContext = createContext()

export default function SpaceBookContextProvider ({children}) {
  const [token, setToken] = useState('')

  // Error modal
  const [errorAlertVisible, setErrorAlertVisible] = useState(false)
  const [errorAlertTitle, setErrorAlertTitle] = useState('')
  const [errorAlertMessage, setErrorAlertMessage] = useState('')

  const setErrorAlertProps = (alertTitle, alertMessage, alertVisible) => {
    setErrorAlertTitle(alertTitle)
    setErrorAlertMessage(alertMessage)
    setErrorAlertVisible(alertVisible)
  }

  useEffect(() => {
    console.log('TOKEN')
    console.log(token)
  }, [token])

  return (
    <SpaceBookContext.Provider value={{
      token,
      setToken,
      errorAlertVisible,
      setErrorAlertVisible,
      errorAlertMessage,
      errorAlertTitle,
      setErrorAlertProps
    }}>
      {children}
    </SpaceBookContext.Provider>
  )
}
