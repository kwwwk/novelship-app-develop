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
import { passwordYupValidation } from 'common/constants/validations';

const ResetPasswordSchema = Yup.object().shape({
  password: passwordYupValidation,
  confirmPassword: Yup.string()
    .required(i18n._(t`Confirm password is required`))
    .oneOf([Yup.ref('password')], i18n._(t`Passwords don't match`)),
});

const initialValues = {
  password: '',
  confirmPassword: '',
};

const ResetPassword = ({ navigation, route }: StackScreenProps<AuthRoutes, 'ResetPassword'>) => {
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [isSuccess, setIsSuccess] = useState<boolean>();

  const { token } = route.params || {};

  const onForgotError = (error: string) => {
    setIsSubmitting(false);
    setFormError(error);
  };

  const submit = (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    API.post('auth/reset', { ...values, token })
      .then(() => setIsSuccess(true))
      .catch(onForgotError);
  };

  const form = useForm({ initialValues, submit, validationSchema: ResetPasswordSchema });

  return (
    <PageContainer my={5}>
      <Box px={2}>
        <Box center>
          <Text variant="title">
            {isSuccess ? i18n._(t`PASSWORD RESET DONE`) : i18n._(t`SET NEW PASSWORD`)}
          </Text>
        </Box>
        {!isSuccess && (
          <>
            <Box mt={5}>
              <Field
                {...form.getInputFields('password', 'password')}
                type="password"
                placeholder="New Password"
              />
            </Box>
            <Box mt={5}>
              <Field
                {...form.getInputFields('confirmPassword', 'password')}
                type="password"
                placeholder="Repeat New Password"
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
              text={i18n._(t`SAVE`)}
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

export default ResetPassword;
