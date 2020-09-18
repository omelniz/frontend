import { useState } from 'react'
import * as authActions from 'store/ducks/auth/actions'
import { useDispatch, useSelector } from 'react-redux'
import trim from 'ramda/src/trim'
import compose from 'ramda/src/compose'
import toLower from 'ramda/src/toLower'
import pathOr from 'ramda/src/pathOr'

const AuthSigninComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const authSignin = useSelector(state => state.auth.authSignin)
  const [formErrorMessage, setFormErrorMessage] = useState()
  const handleErrorClose = () => setFormErrorMessage(undefined)

  const handleFormSubmit = async (values, formApi) => {
    try {
      const nextValues = {
        email: compose(trim, toLower, pathOr('', ['email']))(values),
        password: values.password,
      }

      formApi.setValues(nextValues)

      await new Promise((resolve, reject) => {
        dispatch(
          authActions.authSigninRequest({
            values: { usernameType: 'email', ...nextValues },
            resolve,
            reject,
          }),
        )
      })
    } catch (error) {
      setFormErrorMessage(error.message)
    }
  }

  const formInitialValues = {
    email: pathOr('', ['values', 'email'])(authSignin),
    password: '',
  }

  return children({
    handleFormSubmit,
    formErrorMessage,
    handleErrorClose,
    formInitialValues,
  })
}

export default AuthSigninComponentService
