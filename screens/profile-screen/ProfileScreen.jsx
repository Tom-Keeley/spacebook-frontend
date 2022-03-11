import React, { useContext, useState, useEffect } from 'react'

// Package imports
import { VStack, Center, ScrollView } from 'native-base'
import propTypes from 'prop-types'

// Custom imports
import EditDetails from '../../components/edit-details/EditDetails'
import ErrorPopup from '../../components/error-popup/ErrorPopup'
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner'
import ProfileInformation from '../../components/profile-information/ProfileInformation'
import PersonalDetails from '../../components/personal-details/PersonalDetails'
import PostFab from '../../components/post-fab/PostFab'
import ListOfPosts from '../../components/list-of-posts/ListOfPosts'
import BackButton from '../../components/back-button/BackButton'
import { getPostsForAUser } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'
export default function ProfileScreen ({ route, navigation }) {
  // Local state
  const { id, buttonLocation, userFirstName, userLastName } = route.params
  const [posts, setPosts] = useState([])
  const [updatePost, setUpdatePost] = useState(false)
  const [postToUpdate, setPostToUpdate] = useState({})

  // Context API
  const { token, userId, setErrorAlertProps, loadingSpinnerVisible, errorAlertVisible, firstName, lastName, email, profileType } = useContext(SpaceBookContext)

  // Get a list of posts for a user
  const getPosts = async () => {
    if (profileType === 'personal') {
      const results = await getPostsForAUser(token, userId, setErrorAlertProps)
      const posts = results.posts
      setPosts(posts)
    } else if (profileType === 'userProfile') {
      const results = await getPostsForAUser(token, id, setErrorAlertProps)
      setPosts(results.posts)
    }
  }

  // Update a post
  const updateUserPost = (update, post) => {
    setUpdatePost(update)
    setPostToUpdate(post)
  }

  // On load get a list of posts
  useEffect(() => {
    getPosts()
  }, [])

  // Conditionally render componets based on if its the users own profile or another users
  const renderComponents = () => {
    if (profileType === 'personal') {
      return (
        <>
          <ProfileInformation profileType={profileType} />
          <PersonalDetails />
          <EditDetails navigation={navigation} firstName={firstName} lastName={lastName} email={email} />
          { posts.length !== 0 ? <ListOfPosts id={userId} getPosts={getPosts} posts={posts} updateUserPost={updateUserPost}/> : null }
        </>
      )
    } else if (profileType === 'userProfile') {
      return (
        <>
          <ProfileInformation profileType={profileType} id={id} buttonLocation={buttonLocation} userFirstName={userFirstName} userLastName={userLastName} />
          { posts.length !== 0 ? <ListOfPosts id={id} getPosts={getPosts} posts={posts} updateUserPost={updateUserPost}/> : null }
        </>
      )
    }
  }

  // Conditionally render the fab button depending on if its a friend of the user or not
  const renderCreateButton = () => {
    if (profileType === 'userProfile' && buttonLocation === 'friend') {
      return <PostFab id={id} getPosts={getPosts} updatePost={updatePost} setUpdatePost={setUpdatePost} postToUpdate={postToUpdate}/>
    } else if (profileType === 'personal') {
      return <PostFab id={userId} getPosts={getPosts} updatePost={updatePost} setUpdatePost={setUpdatePost} postToUpdate={postToUpdate}/>
    }
  }

  return (
    <Center w={'100%'} h={'100%'}>
      {profileType === 'userProfile' ? <BackButton navigation={navigation} /> : null}
      <ScrollView h="500">
        {errorAlertVisible && <ErrorPopup />}
        {loadingSpinnerVisible && <LoadingSpinner />}
        <VStack >
          {renderComponents()}
        </VStack>
      </ScrollView>
      {renderCreateButton()}
    </Center>
  )
}

ProfileScreen.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired
  }).isRequired,
  route: propTypes.shape({
    params: propTypes.object
  })
}
