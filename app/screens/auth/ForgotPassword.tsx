import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import * as Yup from 'yup';

import { Box, Button, Text } from 'app/components/base';
import { PageContainer } from 'app/components/layout';
import { Field } from 'app/components/form';
import useForm from 'app/hooks/useForm';
import ErrorMessage from 'app/components/form/ErrorMessage';
import API from 'common/api';
import { AuthRoutes } from 'types/navigation';
import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required(' ')
    .email(i18n._(t`Invalid email`)),
});

const initialValues = {
  email: '',
};

const ForgotPassword = ({ navigation }: StackScreenProps<AuthRoutes, 'ForgotPassword'>) => {
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [isSuccess, setIsSuccess] = useState<boolean>();

  const onForgotError = (error: string) => {
    setIsSubmitting(false);
    setFormError(error);
  };

  const submit = (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    API.post('auth/request-reset', { ...values, mode: 'reset' })
      .then(() => setIsSuccess(true))
      .catch(onForgotError);
  };

  const form = useForm({ initialValues, submit, validationSchema: ForgotPasswordSchema });

  return (
    <PageContainer my={5}>
      <Box px={2}>
        <Text variant="title">
          {isSuccess ? i18n._(t`RESET PASSWORD EMAIL SENT`) : i18n._(t`FORGOT PASSWORD`)}
        </Text>
        <Text fontSize={2} mt={2}>
          {isSuccess
            ? i18n._(t`Please click on the link provided in the email to proceed.`)
            : i18n._(t`Enter your email address to reset your password.`)}
        </Text>
        {!isSuccess && (
          <>
            <Box mt={5} mb={2}>
              <Field
                {...form.getInputFields('email')}
                keyboardType="email-address"
                textContentType="emailAddress"
                onSubmitEditing={form.submitForm}
                autoCapitalize="none"
              />
            </Box>
            <ErrorMessage>{formError}</ErrorMessage>
          </>
        )}

        <Box mt={6} mb={8} width="100%">
          {isSuccess ? (
            <Button
              text={i18n._(t`BACK TO LOGIN`)}
              variant="black"
              onPress={() => navigation.navigate('LogIn')}
            />
          ) : (
            <Button
              text={i18n._(t`SEND RESET LINK`)}
              variant="black"
              loading={isSubmitting}
              onPress={form.submitForm}
            />
          )}
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ForgotPassword;
