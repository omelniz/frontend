import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
} from 'react-native'
import FormComponent from 'components/AuthSigninEmail/Form'
import AuthActionTemplate from 'templates/Auth/Action'
import AuthHeaderTemplate from 'templates/Auth/Header'
import AuthErrorTemplate from 'templates/Auth/Error'
import * as navigationActions from 'navigation/actions'
import { useNavigation } from '@react-navigation/native'
import { withTranslation } from 'react-i18next'
import testIDs from './test-ids'

const AuthSigninEmail = ({
  t,
  formErrorMessage,
  handleFormSubmit,
  handleFormTransform,
  handleErrorClose,
  formSubmitLoading,
  formSubmitDisabled,
  formInitialValues,
}) => {
  const styling = styles
  const navigation = useNavigation()

  return (
    <View testID={testIDs.root} style={styling.root}>
      {formErrorMessage ?
        <AuthErrorTemplate
          text={formErrorMessage}
          onClose={handleErrorClose}
        />
      : null}

      <View style={styling.component}>
        <AuthHeaderTemplate
          title={t('Welcome Back!')}
          subtitle={t('Please login to continue')}
        />

        <View style={styling.content}>
          <FormComponent
            handleFormSubmit={handleFormSubmit}
            handleFormTransform={handleFormTransform}
            formSubmitLoading={formSubmitLoading}
            formSubmitDisabled={formSubmitDisabled}
            formInitialValues={formInitialValues}
          />
        </View>
      </View>

      <AuthActionTemplate testID={testIDs.resetPasswordBtn} onPress={navigationActions.navigateAuthForgotEmail(navigation)}>
        {t('Reset your Password')}
      </AuthActionTemplate>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  component: {
    paddingHorizontal: 24,
    flex: 1,
  },
  content: {
    flex: 1,
  },
})

AuthSigninEmail.propTypes = {
  t: PropTypes.any,
  formErrorMessage: PropTypes.any,
  handleFormSubmit: PropTypes.any,
  handleFormTransform: PropTypes.any,
  handleErrorClose: PropTypes.any,
  formSubmitLoading: PropTypes.any,
  formSubmitDisabled: PropTypes.any,
  formInitialValues: PropTypes.any,
}

export default withTranslation()(AuthSigninEmail)
