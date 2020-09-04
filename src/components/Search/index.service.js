import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import * as postsActions from 'store/ducks/posts/actions'
import { useScrollToTop } from '@react-navigation/native'
import toLower from 'ramda/src/toLower'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersSelector from 'store/ducks/users/selectors'
import * as postsSelector from 'store/ducks/posts/selectors'

const SearchService = ({ children }) => {
  const dispatch = useDispatch()
  const user = useSelector(authSelector.authUserSelector)
  const usersSearch = useSelector(usersSelector.usersSearchSelector())
  const usersFollow = useSelector(state => state.users.usersFollow)
  const usersUnfollow = useSelector(state => state.users.usersUnfollow)
  const usersGetTrendingUsers = useSelector(usersSelector.usersGetTrendingUsersSelector())
  const postsGetTrendingPosts = useSelector(postsSelector.postsGetTrendingPostsSelector())
  const themeFetch = useSelector(state => state.theme.themeFetch)
  const usersAcceptFollowerUser = useSelector(state => state.users.usersAcceptFollowerUser)

  /**
   * FlatList feed ref, used for scroll to top on tab bar press
   */
  const feedRef = useRef(null)
  useScrollToTop(feedRef)

  const usersSearchRequest = ({ searchToken }) => {
    dispatch(usersActions.usersFollowIdle({}))
    dispatch(usersActions.usersUnfollowIdle({}))
    dispatch(usersActions.usersSearchRequest({ searchToken: toLower(searchToken || '') }))
  }

  const usersFollowRequest = ({ userId }) =>
    dispatch(usersActions.usersFollowRequest({ userId }))
  
  const usersUnfollowRequest = ({ userId }) =>
    dispatch(usersActions.usersUnfollowRequest({ userId }))
  
  const usersAcceptFollowerUserRequest = ({ userId }) =>
    dispatch(usersActions.usersAcceptFollowerUserRequest({ userId }))

  const postsGetTrendingPostsRequest = () =>
    dispatch(postsActions.postsGetTrendingPostsRequest({ limit: 100 }))
  
  const postsGetTrendingPostsMoreRequest = (payload) =>
    dispatch(postsActions.postsGetTrendingPostsMoreRequest(payload))

  useEffect(() => {
    dispatch(usersActions.usersGetTrendingUsersRequest({ limit: 30 }))
    // dispatch(postsActions.postsGetTrendingPostsRequest({ limit: 30 }))
  }, [])

  /**
   * Following two states are tracking values of Search/Form -> searchToken input field
   * we are dynamically rendering components on Search/index based on values below
   * 
   * formFocus is a state of focus/blur events: [searchToken input]
   * formChange is a state of value.length: [searchToken input]
   */
  const [formFocus, handleFormFocus] = useState(false)
  const [formChange, handleFormChange] = useState(false)

  return children({
    feedRef,
    user,
    themeFetch,
    usersSearch,
    usersSearchRequest,
    usersFollow,
    usersFollowRequest,
    usersUnfollow,
    usersUnfollowRequest,
    usersAcceptFollowerUser,
    usersAcceptFollowerUserRequest,
    usersGetTrendingUsers,
    postsGetTrendingPostsRequest,
    postsGetTrendingPosts,
    postsGetTrendingPostsMoreRequest,
    formFocus,
    handleFormFocus,
    formChange,
    handleFormChange,
  })
}

export default SearchService
