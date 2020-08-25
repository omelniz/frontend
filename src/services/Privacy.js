import path from 'ramda/src/path'
import is from 'ramda/src/is'

/**
 * Visibility of like button, like button will be visible if:
 * - Post owner has enabled likes
 * - Post owner has not enabled likesDisabled global setting
 * - Like hasn't been set before, which allows only 1 like per post
 */
export const postLikeVisibility = (post, user) => (
  post.likesDisabled === false &&
  !path(['postedBy', 'likesDisabled'])(post) &&
  !path(['likesDisabled'])(user) &&
  path(['postedBy', 'userId'])(post) !== path(['userId'])(user)
)

/**
 * Visibility of comment button, comment button will be visible if:
 * - Post owner has enabled comments
 * - Post owner has not enabled commentsDisabled global setting
 */
export const postCommentVisibility = (post, user) => (
  post.commentsDisabled === false &&
  !path(['postedBy', 'commentsDisabled'])(post) &&
  !path(['commentsDisabled'])(user)
)

/**
 * Visibility of share button, share button will be visible if:
 * - Post owner has enabled shares
 * - Current authenticated user has shares enabled in settings
 * - Current authenticated user is tagged in post by author
 */
export const postShareVisibility = (post, user) => (
  post.sharingDisabled === false &&
  !path(['sharingDisabled'])(user) &&
  (path(['textTaggedUsers'])(post) || [])
    .find(textTag => textTag.tag === `@${path(['username'])(user)}`)
)

/**
 * Visibility of seen by text, text will be visible if:
 * - Current authenticated user owns the post
 * - Post has not enabled viewCountsHidden setting
 * - Post owner has not enabled viewCountsHidden global setting
 */
export const postSeenByVisility = (post, user) => (
  path(['postedBy', 'userId'])(post) === path(['userId'])(user) &&
  !post.viewCountsHidden &&
  !path(['postedBy', 'viewCountsHidden'])(post) &&
  post.viewedByCount > 0
)

/**
 *
 */
export const postRepostVisiblity = (post) => (
  path(['originalPost', 'postedBy', 'username', 'length'])(post) &&
  path(['postedBy', 'username'])(post) !== path(['originalPost', 'postedBy', 'username'])(post)
)

/**
 *
 */
export const postVerificationVisibility = (post) => (
  !postRepostVisiblity(post) &&
  path(['isVerified'])(post) === false &&
  path(['postType'])(post) !== 'TEXT_ONLY'
)

/**
 *
 */
export const selfPostVerificationVisibility = (post, user) => (
  user.userId === path(['postedBy', 'userId'])(post) &&
  postVerificationVisibility(post)
)

/**
 *
 */
export const postExpiryVisiblity = (post) => (
  !postRepostVisiblity(post) &&
  !postVerificationVisibility(post) &&
  path(['expiresAt'])(post)
)

/**
 *
 */
export const postLikedVisibility = (post, user) => (
  path(['onymouslyLikedBy', 'items', '0', 'username'])(post) &&
  !path(['postedBy', 'likesDisabled'])(post) &&
  !post.likesDisabled &&
  path(['postedBy', 'userId'])(post) === user.userId
)

export const userFollowingVisibility = (user) => (
  is(Number)(path(['followersCount'])(user)) &&
  (
    path(['followCountsHidden'])(user) !== true ||
    path(['followedStatus'])(user) === 'SELF'
  ) && !(
    path(['followedStatus'])(user) === 'NOT_FOLLOWING' &&
    path(['privacyStatus'])(user) === 'PRIVATE'
  )
)

export const userFollowerVisibility = (user) => (
  is(Number)(path(['followedsCount'])(user)) &&
  (
    path(['followCountsHidden'])(user) !== true ||
    path(['followedStatus'])(user) === 'SELF'
  ) && !(
    path(['followedStatus'])(user) === 'NOT_FOLLOWING' &&
    path(['privacyStatus'])(user) === 'PRIVATE'
  )
)