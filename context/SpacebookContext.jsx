import React, { createContext, useEffect, useState } from 'react'

// Package imports
import propTypes from 'prop-types'

// Custom imports
import { getNumOfFriendRequests } from '../utils/HelperFunctions'

export const SpaceBookContext = createContext()

export default function SpaceBookContextProvider ({ children }) {
  // Profile Type
  const [profileType, setProfileType] = useState('personal')

  // User Details
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState(0)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [userDetailsUpdated, setUserDetailsUpdated] = useState(false)

  // Loading Spinner
  const [loadingSpinnerVisible, setLoadingSpinnerVisible] = useState(false)

  // Error modal
  const [errorAlertVisible, setErrorAlertVisible] = useState(false)
  const [errorAlertTitle, setErrorAlertTitle] = useState('')
  const [errorAlertMessage, setErrorAlertMessage] = useState('')

  // UserForm modal
  const [formModalVisible, setFormModalVisible] = useState(false)

  // Pagination
  const [pagination, setPagination] = useState(5)

  const setErrorAlertProps = (alertTitle, alertMessage, alertVisible) => {
    setErrorAlertTitle(alertTitle)
    setErrorAlertMessage(alertMessage)
    setErrorAlertVisible(alertVisible)
  }

  // Number of friend requests
  const numOfFriendRequests = async (token, setErrorAlertProps) => {
    const response = await getNumOfFriendRequests(token, setErrorAlertProps)
    if (response.success === true) {
      setTotalFriendRequests(response.num)
    }
  }
  const [totalFriendRequests, setTotalFriendRequests] = useState(0)

  useEffect(() => {
    console.log('TOKEN')
    console.log(token)
  }, [token])

  return (
    <SpaceBookContext.Provider value={{
      token,
      setToken,
      userId,
      setUserId,
      profileType,
      setProfileType,
      pagination,
      setPagination,
      firstName,
      setFirstName,
      lastName,
      setLastName,
      email,
      setEmail,
      userDetailsUpdated,
      setUserDetailsUpdated,
      errorAlertVisible,
      setErrorAlertVisible,
      loadingSpinnerVisible,
      setLoadingSpinnerVisible,
      errorAlertMessage,
      errorAlertTitle,
      setErrorAlertProps,
      formModalVisible,
      setFormModalVisible,
      numOfFriendRequests,
      totalFriendRequests,
      setTotalFriendRequests
    }}>
      {children}
    </SpaceBookContext.Provider>
  )
}

SpaceBookContextProvider.propTypes = {
  children: propTypes.any.isRequired
}
