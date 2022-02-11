import React, { createContext, useEffect, useState } from 'react'

export const SpaceBookContext = createContext()

export default function SpaceBookContextProvider ({children}) {
  // User Details
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState(0)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  // Loading Spinner
  const [loadingSpinnerVisible, setLoadingSpinnerVisible] = useState(false)

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

  useEffect(() => {
    console.log(loadingSpinnerVisible)
  }, [loadingSpinnerVisible])

  return (
    <SpaceBookContext.Provider value={{
      token,
      setToken,
      userId,
      setUserId,
      firstName,
      setFirstName,
      lastName,
      setLastName,
      email,
      setEmail,
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
