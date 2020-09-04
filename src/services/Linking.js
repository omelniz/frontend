import urlPattern from 'url-pattern'

export class MissingDeeplinkParamsError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'MISSING_DEEP_LINK_PARAMS_ERROR'
  }
}

const options = { segmentValueCharset: ':a-zA-Z0-9_-' }
const matchedPostAction = new urlPattern(
  '*/user/(:userId)/post/(:postId)((/):action)(/)((/):actionId)(/)',
  options,
)

export const deeplinkPath = (action) => {
  const params = matchedPostAction.match(action)

  if (action === 'https://real.app/chat/') {
    return { action: 'chats' }
  }

  if (!params || !params.userId || !params.postId) {
    throw new MissingDeeplinkParamsError('Missing userId or postId parameters for post endpoint')
  }

  return params
}

export const deeplinkNavigation = (navigation, navigationActions, Linking) => (action) => {
  try {
    const params = deeplinkPath(action)

    /**
     * Chats screen
     */
    if (params.action === 'chats') {
      return navigationActions.navigateChat(navigation)()
    }

    /**
     * Comments screen
     */
    else if (params && params.action === 'comments') {
      return navigationActions.navigateNestedComments(navigation, params)()
    }

    /**
     * Views screen
     */
    else if (params && params.action === 'views') {
      return navigationActions.navigateNestedPostViews(navigation, params)()
    }

    /**
     * Likes screen
     */
    else if (params && params.action === 'likes') {
      return navigationActions.navigateNestedPostLikes(navigation, params)()
    }

    /**
     * Post screen
     */
    else if (params && !params.action) {
      return navigationActions.navigateNestedPost(navigation, params)()
    }
  } catch (error) {
    if (error.code === 'MISSING_DEEP_LINK_PARAMS_ERROR') {
      return Linking.openURL(action)
    }
  }
}