export const getNumOfFriendRequests = async (token, setErrorAlertProps) => {
  // const { setErrorAlertProps } = useContext(SpaceBookContext)
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
        return json.length
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to do this action please log in', true)
        break
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again', true)
        break
      }
    }
  } catch (err) {
    console.log(err)
    setErrorAlertProps('Error', 'Error occured please try again later', true)
  }
}