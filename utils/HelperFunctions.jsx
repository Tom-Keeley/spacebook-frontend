// Login POST
export const login = async (setErrorAlertProps, formData) => {
  try {
    const response = await fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    })
    switch (response.status) {
      case 200: {
        const json = await response.json()
        return { success: true, token: json.token, userId: json.id }
      }
      case 400: {
        setErrorAlertProps('Unable to sign in', `${await response.text()}`, true)
        return { success: false }
      }
      case 500: {
        setErrorAlertProps('Server error', 'Failed to sign in please try again', true)
        return { success: false }
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps(`${err.message}`, 'Failed to sign in please try again', true)
    return { success: false }
  }
}

// Log out POST
export const logOut = async (token, setErrorAlertProps) => {
  try {
    const response = await fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        'X-Authorization': token
      }
    })

    switch (response.status) {
      case (200):
        return { success: true }
      case (401):
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        return { success: false }
      case (500):
        setErrorAlertProps('Server Error', 'Server error occured please try agai later', true)
        return { success: false }
    }
  } catch (err) {
    console.log(err)
    return { success: false }
  }
}

// Sign up POST
export const signUp = async (setErrorAlertProps, formData) => {
  try {
    const response = await fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email.toLowerCase(),
        password: formData.password
      })
    })

    switch (response.status) {
      case (201): {
        try {
          const response = await fetch('http://localhost:3333/api/1.0.0/login', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            })
          })
          const json = await response.json()
          switch (response.status) {
            case (200): {
              return { success: true, token: json.token, userId: json.id }
            }
            case (400): {
              setErrorAlertProps('Invalid login details', 'Unable to log in please try again', true)
              return { success: false }
            }
            case (500): {
              setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
              return { success: false }
            }
          }
        } catch (err) {
          setErrorAlertProps('Error', 'Error occured please try again', true)
        }
        return { success: false }
      }
      case (400): {
        setErrorAlertProps('Bad Request', 'Unable to sign up please try again', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
        return { success: false }
      }
    }
  } catch (err) {
    setErrorAlertProps(`${err.message}`, 'Failed to sign up please try again', true)
    return { success: false }
  }
}

// Edit details PATCH
export const editDetails = async (token, userId, setErrorAlertProps, formData) => {
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      body: JSON.stringify({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password
      })
    })

    switch (response.status) {
      case 200:
        return { success: true }
      case 400:
        setErrorAlertProps('Bad Request', 'Failed to edit details please try again', true)
        return { success: false }
      case 401:
        setErrorAlertProps('Unauthorised', 'You are not authorised to do this action, plese log in', true)
        return { success: false }
      case 403:
        setErrorAlertProps('Forbidden', 'This action is forbidden', false)
        return { success: false }
      case 404:
        setErrorAlertProps('Not Found', 'Unable to find user details please try again', false)
        return { success: false }
      case 500:
        setErrorAlertProps('Server Error', 'Server Error please try again later', false)
        return { success: false }
    }
  } catch (err) {
    setErrorAlertProps(`${err.message}`, 'Failed to edit details please try again', true)
    console.log('catch error')
    return { success: false }
  }
}

// Get user details GET
export const getUserDetails = async (token, userId, setErrorAlertProps) => {
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    })
    switch (response.status) {
      case (200): {
        const json = await response.json()
        return { success: true, firstName: json.first_name, lastName: json.last_name, email: json.email }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        return { success: false }
      }
      case (404): {
        setErrorAlertProps('User not found', 'User not found please try again', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server occured please try again', true)
        return { success: false }
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps('Error', 'An error occured please try again later', true)
  }
}

// Get user profile picture GET
export const getUserProfile = async (token, userId, setErrorAlertProps) => {
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': token
      }
    })
    switch (response.status) {
      case (200): {
        const resBlob = await response.blob()
        const data = URL.createObjectURL(resBlob)
        return { success: true, data: data }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        return { success: false }
      }
      case (404): {
        setErrorAlertProps('User not found', 'User not found please try again', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server occured please try again', true)
        return { success: false }
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps('Error', 'An error occured please try again later', true)
    return { success: false }
  }
}

// Upload profile picture POST
export const uploadProfilePicture = async (token, userId, setErrorAlertProps, data) => {
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': token
      },
      body: data
    })
    switch (response.status) {
      case (200): {
        return { success: true }
      }
      case (400): {
        setErrorAlertProps('Bad Request', 'Bad request sent please try again', true)
        return { success: false }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        return { success: false }
      }
      case (404): {
        setErrorAlertProps('User not found', 'User not found please try again', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server occured please try again', true)
        return { success: false }
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps('Error', 'An error occured please try again later', true)
    return { success: false }
  }
}

// Get list of friends GET
export const getFriends = async (token, userId, setErrorAlertProps) => {
  try {
    const friendsResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/friends`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Authorization': token
      }
    })

    switch (friendsResponse.status) {
      case (200): {
        const friends = await friendsResponse.json()
        return { success: true, friends: friends }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        return { success: false }
      }
      case (403): {
        setErrorAlertProps('Error', 'Can only view the friends of yourself or your friends', true)
        return { success: false }
      }
      case (404): {
        setErrorAlertProps('Not Found', 'User not found please try again', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Sever error occured please try again later', true)
        return { success: false }
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps('Error', 'An error occured please try again later', true)
    return { success: false }
  }
}

// Get list of friend Requests GET
export const getfriendRequests = async (token, setErrorAlertProps) => {
  try {
    const friendRequestResponse = await fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Authorization': token
      }
    })

    switch (friendRequestResponse.status) {
      case (200): {
        const friendRequests = await friendRequestResponse.json()
        return { success: true, friendRequests: friendRequests }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to do this action please log in', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again', true)
        return { success: false }
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps('Error', 'Error occured please try again later', true)
    return { success: false }
  }
}

// Search for a user or friend
export const searchUsers = async (token, setErrorAlertProps, searchIn, searchValue) => {
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${searchValue}&searchin=${searchIn}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Authorization': token
      }
    })
    switch (response.status) {
      case (200): {
        const results = await response.json()
        return { success: true, results: results }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
        return { success: false }
      }
    }
  } catch (err) {
    setErrorAlertProps('Error', 'An error occured please try again later', true)
    console.log(err)
    return { success: false }
  }
}

// Get list of users - paginated GET
export const getUsersPaginated = async (token, setErrorAlertProps, radioValue, pagination, offset) => {
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/search?search_in=${radioValue}&limit=${pagination}&offset=${offset}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Authorization': token
      }
    })
    switch (response.status) {
      case (200): {
        const tempUsers = await response.json()
        return { success: true, users: tempUsers, length: tempUsers.length }
      }
      case (400): {
        setErrorAlertProps('Start of Results', 'Cannot go back any further', true)
        return { success: false }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
        return { success: false }
      }
    }
  } catch (err) {
    setErrorAlertProps('Error', 'An error occured please try again later', true)
    return { success: false }
  }
}

// Send a friend request POST
export const sendFriendRequest = async (token, setErrorAlertProps, id) => {
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    })

    switch (response.status) {
      case (201): {
        return { success: true }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        return { success: false }
      }
      case (403): {
        setErrorAlertProps('Already Friends', 'You are already friends with this person', true)
        return { success: false }
      }
      case (404): {
        setErrorAlertProps('User Not Found', 'Unable to find user please try again', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
        return { success: false }
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps('Error', 'Error occured please try again later', true)
    return { success: false }
  }
}

// Accept a friend request POST
export const acceptFriendRequest = async (token, setErrorAlertProps, id) => {
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    })

    switch (response.status) {
      case (200): {
        return { success: true }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        return { success: false }
      }
      case (404): {
        setErrorAlertProps('User Not Found', 'Unable to find user please try again', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
        return { success: false }
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps('Error', 'Error occured please try again later', true)
    return { success: false }
  }
}

// Reject a friend request DELETE
export const rejectFriendRequest = async (token, id, setErrorAlertProps) => {
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    })

    switch (response.status) {
      case (200): {
        return { success: true }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        return { success: false }
      }
      case (404): {
        setErrorAlertProps('User Not Found', 'Unable to find user please try again', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
        return { success: false }
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps('Error', 'Error occured please try again later', true)
    return { success: false }
  }
}

// MISC
export const getNumOfFriendRequests = async (token, setErrorAlertProps) => {
  try {
    const friendRequestResponse = await fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Authorization': token
      }
    })

    switch (friendRequestResponse.status) {
      case (200): {
        const json = await friendRequestResponse.json()
        return { success: true, num: json.length }
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to do this action please log in', true)
        return { success: false }
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again', true)
        return { success: false }
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps('Error', 'Error occured please try again later', true)
    return { success: false }
  }
}
