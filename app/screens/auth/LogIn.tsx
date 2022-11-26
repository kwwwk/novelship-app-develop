import { AuthRoutes, RootRoutes } from 'types/navigation';

import React, { useContext, useState } from 'react';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import * as Yup from 'yup';

import { KeyboardAwareContainer, ScrollContainer, PageContainer } from 'app/components/layout';
import { Button, Anchor, Text, Box } from 'app/components/base';
import { useStoreActions } from 'app/store';
import { Field } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import useForm from 'app/hooks/useForm';

import { SocialAuth } from './components/Social';
import LoginSignUpSwitcher from './components/LoginSignupSwitcher';
import AuthBanner from './components/AuthBanner';
import AuthContext from './context';

type LoginNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthRoutes, 'LogIn'>,
  StackNavigationProp<RootRoutes, 'AuthStack'>
>;

const initialValues = {
  email: '',
  password: '',
};

const LogIn = ({ navigation }: { navigation: LoginNavigationProp }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [formError, setFormError] = useState<string>('');
  const { setLoginValues } = useContext(AuthContext);

  const login = useStoreActions((a) => a.user.login);

  const onLoginError = (error: string) => {
    setIsSubmitting(false);
    setFormError(error);
  };

  const submit = (values: typeof initialValues) => {
    setIsSubmitting(true);
    login(values)
      .then(({ otpSent, csrfToken }: { otpSent: boolean; csrfToken: string }) => {
        setFormError('');
        setIsSubmitting(false);

        if (otpSent) {
          setLoginValues({ ...values, csrf: csrfToken });
          navigation.navigate('LoginOTP');
        }
      })
      .catch(onLoginError);
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required(i18n._(t`Email is required`))
      .email(i18n._(t`Invalid email`)),
    password: Yup.string().required(i18n._(t`Password is required`)),
  });

  const form = useForm<typeof initialValues>({
    initialValues,
    submit,
    validationSchema: LoginSchema,
  });

  return (
    <KeyboardAwareContainer behavior="position" keyboardVerticalOffset={16}>
      <ScrollContainer>
        <AuthBanner screen="login" />
        <PageContainer my={5}>
          <LoginSignUpSwitcher screen="login" />
          <Box my={4} />
          <Box px={2}>
            <SocialAuth screen="login" />
            <Text textAlign="center" color="gray4" fontFamily="medium" fontSize={2} my={5}>
              <Trans>OR</Trans>
            </Text>

            <Box px={1}>
              <Box width="100%" mb={5}>
                <Field
                  {...form.getInputFields('email')}
                  textContentType="emailAddress"
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Box>

              <Box width="100%" mb={5}>
                <Field
                  {...form.getInputFields('password', 'password')}
                  type="password"
                  placeholder="Password"
                  onSubmitEditing={form.submitForm}
                />
              </Box>
            </Box>

            <ErrorMessage mb={4}>{i18n._(formError)}</ErrorMessage>

            <Box mt={5} mb={7} width="100%">
              <Button
                text={i18n._(t`LOG IN`)}
                variant="black"
                onPress={form.submitForm}
                loading={isSubmitting}
              />
            </Box>

            <Anchor
              fontFamily="medium"
              textAlign="center"
              textDecorationLine="underline"
              fontSize={3}
              action={() => navigation.push('ForgotPassword')}
            >
              <Trans>Forgot Password?</Trans>
            </Anchor>
          </Box>
        </PageContainer>
      </ScrollContainer>
    </KeyboardAwareContainer>
  );
};

export default LogIn;
