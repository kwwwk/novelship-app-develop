import React, { useState } from 'react';
import * as Yup from 'yup';
import { useStoreState, useStoreActions } from 'app/store';
import { Box, Button, ButtonBase, Text } from 'app/components/base';
import { Field } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import {
  Footer,
  KeyboardAwareContainer,
  PageContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import useForm from 'app/hooks/useForm';
import { validName } from 'common/constants/validations';
import { UserRoutes } from 'types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { Keyboard } from 'react-native';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Analytics from 'app/services/analytics';

const ProfileInfoSchema = Yup.object().shape({
  firstname: Yup.string()
    .required(i18n._(t`First name is required`))
    .matches(validName, i18n._(t`Please enter valid name`))
    .max(20, i18n._(t`Maximum 20 character allowed`)),
  lastname: Yup.string()
    .required(i18n._(t`Last name is required`))
    .matches(validName, i18n._(t`Please enter valid name`))
    .max(20, i18n._(t`Maximum 20 character allowed`)),
  email: Yup.string()
    .required(i18n._(t`Email is required`))
    .email(i18n._(t`Invalid Email`)),
  otp: Yup.string().matches(/^[A-Z0-9]*$/, i18n._(t`Invalid verification code`)),
});

const ProfileForm = ({ navigation }: StackScreenProps<UserRoutes, 'ProfileForm'>) => {
  const user = useStoreState((s) => s.user.user);
  const updateUser = useStoreActions((a) => a.user.update);
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [isOtp, setIsOtp] = useState<boolean>(false);

  const initialValues = {
    otp: '',
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    username: user.username || '',
    email: user.email || '',
  };

  const submit = (values: typeof initialValues) => {
    setIsSubmitting(true);
    Keyboard.dismiss();
    updateUser({ ...values, username: values.username || undefined })
      .then((data) => {
        if (data?.otpSent) {
          return setIsOtp(true);
        }
        Analytics.profileUpdate('profile');
        navigation.goBack();
      })
      .catch(setFormError)
      .finally(() => setIsSubmitting(false));
  };

  const form = useForm({ initialValues, submit, validationSchema: ProfileInfoSchema });

  const onResendOTP = () => {
    form.setFieldValue('otp', '');
    form.submitForm();
  };

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <PageContainer mt={5} mb={10}>
            <Box my={4} />
            <Box>
              <Box>
                <Box mb={5} width="100%" style={{ flexDirection: 'row' }}>
                  <Box width="48.5%" style={{ marginRight: '3%' }}>
                    <Field {...form.getInputFields('firstname')} label="First name" />
                  </Box>
                  <Box width="48.5%">
                    <Field {...form.getInputFields('lastname')} label="Last name" />
                  </Box>
                </Box>
                <Box mb={5} width="100%">
                  <Field
                    {...form.getInputFields('username')}
                    label="Username"
                    editable={!user.username}
                  />
                </Box>
                <Box mb={5} width="100%">
                  <Field
                    {...form.getInputFields('email')}
                    textContentType="emailAddress"
                    label="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Box>
                {isOtp && (
                  <Box mb={5} width="100%">
                    <Field
                      {...form.getInputFields('otp')}
                      label="Verification Code"
                      placeholder="Verification Code"
                      textContentType="oneTimeCode"
                      maxLength={6}
                    />
                    <Text fontSize={1} mt={2} lineHeight={14}>
                      <Trans>
                        We have sent a Verification Code to your email. (Please also check your spam
                        folder.)
                      </Trans>
                    </Text>
                    {isOtp && (
                      <Box width="100%">
                        <ButtonBase onPress={onResendOTP}>
                          <Text fontSize={2} textDecorationLine="underline">
                            <Trans>Resend Verification Code</Trans>
                          </Text>
                        </ButtonBase>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </PageContainer>
        </ScrollContainer>

        <Footer>
          <>
            <ErrorMessage mb={4}>{formError}</ErrorMessage>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Button
                variant="white"
                size="lg"
                width="49%"
                text={i18n._(t`CANCEL`)}
                onPress={() => navigation.goBack()}
              />
              <Button
                text={i18n._(t`SAVE`)}
                variant="black"
                size="lg"
                width="49%"
                onPress={form.submitForm}
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </Box>
          </>
        </Footer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

export default ProfileForm;
