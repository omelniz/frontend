import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import TextField from 'components/Formik/TextField'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import Config from 'react-native-config'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { withTranslation } from 'react-i18next'

const formSchema = Yup.object().shape({
  username: Yup.string()
    .min(3)
    .max(50)
    .matches(/^[a-zA-Z0-9_.]{3,30}$/, 'username must only contain letters & numbers')
    .trim()
    .required()
    .test('usernameReserve', 'username is reserved', (value) =>
      new Promise((resolve, reject) => {
        fetch(`${Config.AWS_API_GATEWAY_ENDPOINT}/username/status?username=${value}`, {
          method: 'GET',
          headers: {
            'X-Api-Key': Config.AWS_API_GATEWAY_KEY,
          },
        })
        .then((resp) => resp.json())
        .then((resp) => resolve(resp.status === 'AVAILABLE'))
        .catch((error) => resolve(true))
      })
    ),
})

const CognitoForm = ({
  t,
  theme,
  handleSubmit,
  loading,
  disabled,
  dirty,
  isValid,
  isValidating,
}) => {
  const styling = styles(theme)

  const submitDisabled = (
    disabled ||
    !isValid ||
    isValidating
  )

  return (
    <View style={styling.root}>
      <View style={styling.input}>
        <Field testID="components/AuthCognito/Form/username" name="username" component={TextField} placeholder={t('Username')} keyboardType="default" textContentType="username" autoCompleteType="username" autoFocus />
      </View>
      <View style={styling.input}>
        <DefaultButton testID="components/AuthCognito/Form/submit" label={t('Next')} onPress={handleSubmit} loading={loading} disabled={submitDisabled} />
      </View>
    </View>
  )
}

const styles = theme => StyleSheet.create({
  root: {
  },
  input: {
    marginBottom: 12,
  },
})

CognitoForm.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  handleSubmit: PropTypes.any,
  loading: PropTypes.any,
}

export default withTranslation()(withTheme(({
  handleFormSubmit,
  handleFormTransform,
  formSubmitLoading,
  formSubmitDisabled,
  formInitialValues,
  ...props
}) => (
  <Formik
    initialValues={formInitialValues}
    validationSchema={formSchema}
    onSubmit={handleFormSubmit}
    enableReinitialize
  >
    {(formikProps) => (
      <CognitoForm
        {...formikProps}
        {...props}
        loading={formSubmitLoading}
        disabled={formSubmitDisabled}
        handleSubmit={() => {
          const nextValues = handleFormTransform(formikProps.values)
          formikProps.setValues(nextValues)
          handleFormSubmit(nextValues)
        }}
      />
    )}
  </Formik>
)))
