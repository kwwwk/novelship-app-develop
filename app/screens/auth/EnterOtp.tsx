// UNUSED
import React, { useState, useContext } from 'react';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import * as Yup from 'yup';

import { Box, Button, Text } from 'app/components/base';
import { PageContainer } from 'app/components/layout';
import { Field } from 'app/components/form';
import { useStoreActions } from 'app/store';
import useForm from 'app/hooks/useForm';
import ErrorMessage from 'app/components/form/ErrorMessage';
import Analytics from 'app/services/analytics';

import AuthContext from './context';

const OtpVerificationSchema = Yup.object().shape({
  otp: Yup.number()
    .typeError(i18n._(t`Invalid code`))
    .required(' '),
});

const initialValues = {
  otp: '',
};

const EnterOtp = () => {
  const signup = useStoreActions((a) => a.user.signup);
  const { signupValues } = useContext(AuthContext);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();

  const onVerificationError = (error: string) => {
    setIsSubmitting(false);
    setFormError(error);
  };

  const resendOtp = () => {
    setIsSubmitting(true);
    const newUser = { ...signupValues };
    signup(newUser)
      .then(() => setIsSubmitting(false))
      .catch(onVerificationError);
  };

  const submit = (values: typeof initialValues) => {
    setIsSubmitting(true);
    const newUser = { ...signupValues, ...values };
    signup(newUser)
      .then((payload) => {
        Analytics.signup('Complete', payload, 'email', {
          'Referrer Code': newUser.referral_code,
        });
      })
      .catch(onVerificationError);
  };

  const form = useForm({ initialValues, submit, validationSchema: OtpVerificationSchema });

  return (
    <PageContainer my={5}>
      <Box px={2}>
        <Text variant="title">
          <Trans>VERIFY YOUR PHONE NUMBER</Trans>
        </Text>
        <Text fontSize={2} mt={2}>
          <Trans>We have sent an OTP to "{signupValues.phone}". Please enter it to continue.</Trans>
        </Text>
        <Box mt={5} mb={2}>
          <Field
            {...form.getInputFields('otp')}
            keyboardType="numeric"
            placeholder="000000"
            textContentType="oneTimeCode"
            onSubmitEditing={form.submitForm}
            style={{ letterSpacing: 12 }}
            maxLength={6}
          />
        </Box>
        <ErrorMessage mb={2}>{formError}</ErrorMessage>
        <Text fontSize={2} mt={2} onPress={resendOtp}>
          <Trans>
            Didn't receive SMS?{' '}
            <Text fontSize={2} fontFamily="bold" textDecorationLine="underline">
              RESEND OTP
            </Text>
          </Trans>
        </Text>

        <Box mt={6} mb={8} width="100%">
          <Button
            text={i18n._(t`VERIFY OTP`)}
            variant="black"
            loading={isSubmitting}
            onPress={form.submitForm}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default EnterOtp;
