import React, { createContext, useEffect, useState } from 'react'

export const SpaceBookContext = createContext()

export default function SpaceBookContextProvider ({children}) {
  const [token, setToken] = useState('')

  // Error modal
  const [errorAlertVisible, setErrorAlertVisible] = useState(false)
  const [errorAlertTitle, setErrorAlertTitle] = useState('')
  const [errorAlertMessage, setErrorAlertMessage] = useState('')

  // Loading Spinner
  const [loadingSpinnerVisible, setLoadingSpinnerVisible] = useState(false)

  const setErrorAlertProps = (alertTitle, alertMessage, alertVisible) => {
    setErrorAlertTitle(alertTitle)
    setErrorAlertMessage(alertMessage)
    setErrorAlertVisible(alertVisible)
  }

  useEffect(() => {
    console.log('TOKEN')
    console.log(token)
  }, [token])

  useEffect(() => {
    console.log(loadingSpinnerVisible)
  }, [loadingSpinnerVisible])

  return (
    <SpaceBookContext.Provider value={{
      token,
      setToken,
      errorAlertVisible,
      setErrorAlertVisible,
      loadingSpinnerVisible,
      setLoadingSpinnerVisible,
      errorAlertMessage,
      errorAlertTitle,
      setErrorAlertProps
    }}>
      {children}
    </SpaceBookContext.Provider>
  )
}
