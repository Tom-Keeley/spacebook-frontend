import React, { useContext, useState, useEffect } from 'react'
import { VStack, Center, ScrollView } from 'native-base'
import propTypes from 'prop-types'

// Custom imports
import EditDetails from '../../components/edit-details/EditDetails'
import ErrorPopup from '../../components/error-popup/ErrorPopup'
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner'
import ProfileInformation from '../../components/profile-information/ProfileInformation'
import PersonalDetails from '../../components/personal-details/PersonalDetails'
import CreatePost from '../../components/create-post/CreatePost'
import ListOfPosts from '../../components/list-of-posts/ListOfPosts'
import BackButton from '../../components/back-button/BackButton'
import { getPostsForAUser } from '../../utils/HelperFunctions'

// ContextAPI
import { SpaceBookContext } from '../../context/SpacebookContext'
export default function ProfileScreen ({ route, navigation }) {
  const { token, userId, setErrorAlertProps, loadingSpinnerVisible, errorAlertVisible, firstName, lastName, email, profileType } = useContext(SpaceBookContext)
  const { id, buttonLocation, userFirstName, userLastName } = route.params
  const [posts, setPosts] = useState([])
  const [updatePost, setUpdatePost] = useState(false)
  const [postToUpdate, setPostToUpdate] = useState({})
  console.log(profileType, ' ' + id + ' ' + userFirstName + ' ' + userLastName)

  const getPosts = async () => {
    if (profileType === 'personal') {
      const results = await getPostsForAUser(token, userId, setErrorAlertProps)
      setPosts(results.posts)
    } else if (profileType === 'userProfile') {
      const results = await getPostsForAUser(token, id, setErrorAlertProps)
      setPosts(results.posts)
    }
  }

  const updateUserPost = (update, post) => {
    setUpdatePost(update)
    setPostToUpdate(post)
  }

  useEffect(() => {
    console.log(updatePost)
  }, [updatePost])

  useEffect(() => {
    getPosts()
  }, [])

  const renderComponents = () => {
    if (profileType === 'personal') {
      return (
        <>
          <ProfileInformation profileType={profileType} />
          <PersonalDetails />
          <EditDetails navigation={navigation} firstName={firstName} lastName={lastName} email={email} />
          <ListOfPosts id={userId} getPosts={getPosts} posts={posts} updateUserPost={updateUserPost}/>
        </>
      )
    } else if (profileType === 'userProfile') {
      return (
        <>
          <ProfileInformation profileType={profileType} id={id} buttonLocation={buttonLocation} userFirstName={userFirstName} userLastName={userLastName} />
          {buttonLocation === 'friend' ? <ListOfPosts id={id} getPosts={getPosts} posts={posts} updateUserPost={updateUserPost} /> : null}
        </>
      )
    }
  }

  const renderCreateButton = () => {
    if (profileType === 'userProfile' && buttonLocation === 'friend') {
      return <CreatePost id={id} getPosts={getPosts} updatePost={updatePost} setUpdatePost={setUpdatePost} postToUpdate={postToUpdate}/>
    } else if (profileType === 'personal') {
      return <CreatePost id={userId} getPosts={getPosts} updatePost={updatePost} setUpdatePost={setUpdatePost} postToUpdate={postToUpdate}/>
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
