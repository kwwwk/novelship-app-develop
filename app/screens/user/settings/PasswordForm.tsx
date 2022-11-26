import React, { useState } from 'react';

import { Keyboard } from 'react-native';
import * as Yup from 'yup';
import { Box, Button } from 'app/components/base';
import useForm from 'app/hooks/useForm';
import { Field } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import {
  Footer,
  KeyboardAwareContainer,
  PageContainer,
  ScrollContainer,
  SafeAreaScreenContainer,
} from 'app/components/layout';
import API from 'common/api';
import { UserRoutes } from 'types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { passwordYupValidation } from 'common/constants/validations';

const ResetPasswordSchema = Yup.object().shape({
  old_password: Yup.string().required(),
  password: passwordYupValidation,
  confirm_password: Yup.string()
    .required(' ')
    .oneOf([Yup.ref('password'), null], i18n._(t`Passwords don't match`)),
});

const PasswordForm = ({ navigation }: StackScreenProps<UserRoutes, 'PasswordForm'>) => {
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();

  const initialValues = {
    old_password: '',
    password: '',
    confirm_password: '',
  };

  const submit = (values: typeof initialValues) => {
    setIsSubmitting(true);
    setFormError('');
    Keyboard.dismiss();

    API.put('me/change-password', {
      newPasswordAgain: values.confirm_password,
      currentPassword: values.old_password,
      newPassword: values.password,
    })
      .then(() => navigation.goBack())
      .catch(setFormError)
      .finally(() => setIsSubmitting(false));
  };

  const form = useForm<typeof initialValues>({
    initialValues,
    submit,
    validationSchema: ResetPasswordSchema,
  });

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <PageContainer mt={5} mb={10}>
            <Box my={4} />
            <Box>
              <Box px={1}>
                <Box width="100%" mb={5}>
                  <Field
                    {...form.getInputFields('old_password', 'password')}
                    type="password"
                    label="Old Password"
                  />
                </Box>
                <Box width="100%" mb={5}>
                  <Field
                    {...form.getInputFields('password', 'password')}
                    type="password"
                    label="New Password"
                  />
                </Box>
                <Box width="100%" mb={5}>
                  <Field
                    {...form.getInputFields('confirm_password', 'password')}
                    type="password"
                    label="Confirm New Password"
                  />
                </Box>
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
              />
            </Box>
          </>
        </Footer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

export default PasswordForm;
