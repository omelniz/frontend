/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "element", "shouldStayOnSignInScreenAfterSubmit"] }] */
import {credentials, valid} from './data.mock'
import * as actions from './actions'
import * as utils from '../../helpers/utils'

async function getFields() {
  return {
    email: element(by.id('components/AuthSignin/Form/username')),
    password: element(by.id('components/AuthSignin/Form/password')),
  }
}

async function shouldStayOnSignInScreenAfterSubmit() {
  await element(by.id('components/AuthSignin/Form/submit')).tap()
  await expect(element(by.id('components/AuthSigninEmail'))).toBeVisible()
}

describe('Feature: Sign in', () => {
  beforeAll(async () => {
    await device.launchApp({permissions: {notifications: 'YES'}, newInstance: true})
  })

  describe('As a user I want to not be able to sign in with incorrect credentials', () => {
    it('Given: Unauthorized user on signin screen', async () => {
      await actions.openSignInForm()
      await expect(element(by.id('components/AuthSigninEmail'))).toBeVisible()
    })

    describe('Rule: Email validation', () => {
      let email

      beforeAll(async () => {
        const fields = await getFields()

        email = fields.email
        await fields.password.typeText(valid.password)
      })

      beforeEach(async () => {
        await email.clearText()
      })

      it('Example: email is a required field', async () => {
        await shouldStayOnSignInScreenAfterSubmit()
      })

      it('Example: must be at least 3 characters', async () => {
        await email.typeText(utils.generateString({length: 2}))
        await shouldStayOnSignInScreenAfterSubmit()
      })

      it('Example: must be at most 50 characters', async () => {
        await email.typeText(utils.generateString({length: 51}))
        await shouldStayOnSignInScreenAfterSubmit()
      })

      it('Example: must be valid email', async () => {
        async function testEmail(value) {
          await email.clearText()
          await email.typeText(value)
          await shouldStayOnSignInScreenAfterSubmit()
        }

        await testEmail('notvalid')
        await testEmail('notvalid@')
        await testEmail('notvalid@email')
        await testEmail('notvalid@email.')
      })
    })

    describe('Rule: Password validation', () => {
      let password

      beforeAll(async () => {
        const fields = await getFields()

        password = fields.password
        await fields.email.typeText(valid.email)
      })

      beforeEach(async () => {
        await password.clearText()
      })

      it('Example: password is a required field', async () => {
        await shouldStayOnSignInScreenAfterSubmit()
      })

      it('Example: must be at least 8 characters', async () => {
        await password.typeText(utils.generateString({length: 7}))
        await shouldStayOnSignInScreenAfterSubmit()
      })

      it('Example: must be at most 50 characters', async () => {
        await password.typeText(utils.generateString({length: 51}))
        await shouldStayOnSignInScreenAfterSubmit()
      })
    })
  })

  describe('As a user I want to sign in with right credentials', () => {
    it('Given: Unauthorized user on auth home screen', async () => {
      await device.reloadReactNative()
      await expect(element(by.id('components/AuthHome'))).toBeVisible()
    })

    it('Then tap by the Sign In button', async () => {
      await element(by.id('components/AuthHome/BottomAction')).tap()
    })

    it('When sign in by phone screen open', async () => {
      await expect(element(by.id('components/AuthSigninPhone'))).toBeVisible()
    })

    it('Then tap by email tab', async () => {
      await element(by.id('navigation/AuthNavigator/Signin/email')).tap()
    })

    it('When sign in by email screen open', async () => {
      await expect(element(by.id('components/AuthSigninEmail'))).toBeVisible()
    })

    it('Then submit sign in form with right credentials', async () => {
      await element(by.id('components/AuthSignin/Form/username')).typeText(credentials.username)
      await element(by.id('components/AuthSignin/Form/password')).typeText(credentials.password)
      await element(by.id('components/AuthSignin/Form/submit')).tap()
    })

    it('Then authorized user on upload profile pictire screen', async () => {
      await expect(element(by.id('components/AuthPhoto'))).toBeVisible()
    })
  })
})
