import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as navigationActions from 'navigation/actions'
import { useNavigation } from '@react-navigation/native'
import * as usersSelector from 'store/ducks/users/selectors'

const ProfilePhotoGridService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUserSelector)
  const usersImagePostsGet = useSelector(usersSelector.usersImagePostsGetSelector())
  const usersEditProfile = useSelector(state => state.users.usersEditProfile)
  
  const usersImagePostsGetRequest = (payload) =>
    dispatch(usersActions.usersImagePostsGetRequest(payload))

  const usersEditProfileRequest = () =>
    dispatch(usersActions.usersEditProfileRequest({ photoPostId: selectedPost.postId }))

  useEffect(() => {
    usersImagePostsGetRequest({ userId: user.userId })
  }, [])

  useEffect(() => {
    if (usersEditProfile.status === 'success') {
      navigationActions.navigateProfileSelf(navigation)()
      dispatch(usersActions.usersEditProfileIdle({}))
    }
  }, [usersEditProfile.status])

  const [selectedPost, setSelectedPost] = useState({})
  const handlePostPress = (post) => setSelectedPost(post)

  return children({
    usersImagePostsGet,
    usersImagePostsGetRequest,
    handlePostPress,
    selectedPost,
    usersEditProfileRequest,
  })
}

export default ProfilePhotoGridService
