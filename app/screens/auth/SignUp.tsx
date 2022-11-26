import React, { useContext, useState, useRef } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import * as Yup from 'yup';

import { AuthRoutes } from 'types/navigation';
import { Anchor, Box, Button, ButtonBase, Text } from 'app/components/base';
import { Field } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import { ScrollContainer, KeyboardAwareContainer, PageContainer } from 'app/components/layout';
import useForm from 'app/hooks/useForm';
import { useStoreActions, useStoreState } from 'app/store';
import Analytics from 'app/services/analytics';
import { LanguageType } from 'app/services/language';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { LB } from 'common/constants';
import { checkPassword } from 'common/constants/validations';
import { RouteProp, useRoute } from '@react-navigation/native';
import AuthBanner from './components/AuthBanner';
import LoginSignUpSwitcher from './components/LoginSignupSwitcher';
import { SocialAuth } from './components/Social';
import AuthContext from './context';
import PasswordCheck from './components/PasswordCheck';
import { signupDropOffTracking } from './utils/signup';

const SignUp = ({ navigation }: StackScreenProps<AuthRoutes, 'SignUp'>) => {
  const signup = useStoreActions((a) => a.user.signup);
  const { setSignupValues } = useContext(AuthContext);

  const currentCountry = useStoreState((s) => s.country.current);
  const currentLanguage = useStoreState((s) => s.language.current);
  const openReferralInputDialog = useStoreActions((a) => a.referralInputDialog.openDialog);
  const isEmailTouched = useRef<boolean>(false);

  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [isOtp, setIsOtp] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = React.useState<boolean>(false);

  const route = useRoute<RouteProp<AuthRoutes, 'SignUp'>>();
  const signup_reference = route.params?.signup_reference;

  const onSignupError = (error: string) => {
    setIsSubmitting(false);
    setFormError(error);
    form.setFieldValue('otp', '');
  };

  const submit = (values: typeof initialValues) => {
    if (checkPassword(values.password, {}).password) return setShowPasswordCheck(true);
    setIsSubmitting(true);
    const newUser = {
      ...values,
      signup_reference,
      country_id: currentCountry.id,
      locale: currentLanguage as LanguageType,
    };
    signup(newUser)
      .then((payload) => {
        setFormError('');
        setIsSubmitting(false);

        if (payload.otpSent) {
          setIsOtp(true);
          return;
        }
        Analytics.signup('Complete', payload, 'email');
        setTimeout(openReferralInputDialog, 1000);
        setSignupValues(newUser);
      })
      .catch(onSignupError);
  };

  const initialValues = {
    // firstname: '',
    // lastname: '',
    // country_code: currentCountry.calling_code || '',
    // phone: '',
    email: '',
    password: '',
    // confirm_password: '',
    termsAgree: false,
    otp: '',
    // referral_code: '',
  };

  const SignupSchema = Yup.object().shape({
    // firstname: Yup.string()
    //   .required('First name is required')
    //   .matches(validName, 'Please enter valid name'),
    // lastname: Yup.string()
    //   .required('Last name is required')
    //   .matches(validName, 'Please enter valid name'),
    // country_code: Yup.string().required('Country code is required'),
    // phone: Yup.number().typeError('Invalid phone number').required('Phone is required'),
    email: Yup.string()
      .required(i18n._(t`Email is required`))
      .email(i18n._(t`Invalid Email`)),
    password: Yup.string().required(i18n._(t`Password is required`)),
    // confirm_password: Yup.string()
    //   .required('Confirm password is required ')
    //   .oneOf([Yup.ref('password')], "Passwords don't match"),
    termsAgree: Yup.boolean().oneOf([true], ' '),
    ...(isOtp && {
      otp: Yup.string().matches(/^[A-Z0-9]*$/, i18n._(t`Invalid verification code`)),
    }),
  });

  const form = useForm<typeof initialValues>({
    initialValues,
    submit,
    validationSchema: SignupSchema,
  });

  const onResendOTP = () => {
    form.setFieldValue('otp', '');
    form.submitForm();
  };

  const onEmailFocus = () => {
    if (!isEmailTouched.current) {
      isEmailTouched.current = true;
      Analytics.signupEvent('Method select', { Method: 'email' });
      signupDropOffTracking({ shortcode: currentCountry.shortcode, language: currentLanguage });
    }
  };

  const password = form.getInputFields('password').value as string;

  return (
    <KeyboardAwareContainer behavior="position" keyboardVerticalOffset={16}>
      <ScrollContainer>
        <AuthBanner screen="signup" />
        <PageContainer my={5}>
          <LoginSignUpSwitcher screen="signup" />
          <Box my={4} />
          <Box px={2}>
            <SocialAuth screen="signup" />
            <Text textAlign="center" color="gray4" fontFamily="medium" fontSize={2} my={5}>
              <Trans>OR</Trans>
            </Text>

            <Box px={1}>
              {/* <Box mb={5} width="100%">
                <Field
                  {...form.getInputFields('firstname')}
                  label="FIRST NAME"
                  textContentType="givenName"
                  keyboardType="name-phone-pad"
                />
              </Box>

              <Box mb={5} width="100%">
                <Field
                  {...form.getInputFields('lastname')}
                  label="LAST NAME"
                  textContentType="familyName"
                  keyboardType="name-phone-pad"
                />
              </Box> */}

              <Box mb={5} width="100%">
                <Field
                  {...form.getInputFields('email')}
                  textContentType="emailAddress"
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={onEmailFocus}
                />
              </Box>

              <Box mb={5} width="100%">
                <Field
                  {...form.getInputFields('password', 'password')}
                  type="password"
                  placeholder="Password"
                  onFocus={() => setShowPasswordCheck(true)}
                />
                <Box mt={2}>{showPasswordCheck && <PasswordCheck password={password} />}</Box>
              </Box>
              {isOtp && (
                <Box mb={5} width="100%">
                  <Field
                    {...form.getInputFields('otp')}
                    label="Verification Code"
                    placeholder="Verification Code"
                    textContentType="oneTimeCode"
                    keyboardType="numeric"
                    maxLength={6}
                  />
                  <Text fontSize={1} mt={3}>
                    <Trans>
                      We have sent a Verification Code to your email. (Please also check your spam
                      folder.)
                    </Trans>
                  </Text>
                </Box>
              )}
              {/*
              <Box mb={5} width="100%">
                <Field {...form.getInputFields('confirm_password', 'password')} />
              </Box>

              <Box mb={5} width="100%">
                <Field {...form.getInputFields('referral_code')} autoCapitalize="characters" />
              </Box>

              <Box mb={4} width="100%" style={{ flexDirection: 'row' }}>
                <Box width="48.5%" style={{ marginRight: '3%' }}>
                  <Field
                    {...form.getInputFields('country_code')}
                    label="Calling Code"
                    type="select"
                    items={countries.map((country) => ({
                      label: `${country.name}  (${country.calling_code})`,
                      value: country.calling_code || '',
                      inputLabel: country.calling_code,
                    }))}
                  />
                </Box>
                <Box width="48.5%">
                  <Field
                    {...form.getInputFields('phone')}
                    label="Phone Number"
                    textContentType="telephoneNumber"
                    keyboardType="phone-pad"
                  />
                </Box>
              </Box> */}
            </Box>

            <ErrorMessage mb={4}>{formError}</ErrorMessage>

            <Box center width="100%">
              <Field {...form.getInputFields('termsAgree')} type="checkbox">
                <Text fontSize={2}>
                  {i18n._(t`I agree to the`)}{' '}
                  <Anchor to="terms" textDecorationLine="underline" fontSize={2}>
                    {i18n._(t`Terms`)}
                  </Anchor>{' '}
                  &amp;{' '}
                  <Anchor to="privacy" textDecorationLine="underline" fontSize={2}>
                    {i18n._(t`Privacy Policy`)}
                  </Anchor>
                </Text>
              </Field>
            </Box>
            {isOtp && (
              <Box width="100%" mt={3}>
                <ButtonBase onPress={onResendOTP}>
                  <Text fontSize={2} textDecorationLine="underline">
                    {i18n._(t`Resend Verification Code`)}
                  </Text>
                </ButtonBase>
              </Box>
            )}
            <Box mt={5} width="100%">
              <Button
                text={isOtp ? i18n._(t`SIGN UP`) : i18n._(t`SEND VERIFICATION CODE`)}
                variant="black"
                loading={isSubmitting}
                onPress={() => {
                  if (isOtp) {
                    Analytics.signupEvent('Confirm OTP', {
                      Method: 'email',
                      'Number of Digits': form.getInputFields('otp').value.toString().length,
                    });
                  } else {
                    Analytics.signupEvent('Request OTP', { Method: 'email' });
                  }
                  form.submitForm();
                }}
              />
            </Box>

            <Text mt={8} textAlign="center" onPress={() => navigation.replace('LogIn')}>
              <Trans>
                Already have an account? {LB}
                <Text fontFamily="bold" textDecorationLine="underline">
                  LOG IN
                </Text>
              </Trans>
            </Text>
          </Box>
        </PageContainer>
      </ScrollContainer>
    </KeyboardAwareContainer>
  );
};

export default SignUp;
