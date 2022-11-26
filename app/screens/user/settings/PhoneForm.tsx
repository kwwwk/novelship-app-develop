import React, { useState } from 'react';
import * as Yup from 'yup';

import { Box, Button, ButtonBase, Text } from 'app/components/base';
import useForm from 'app/hooks/useForm';
import { Field } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import { useStoreActions, useStoreState } from 'app/store';
import API from 'common/api';
import {
  Footer,
  KeyboardAwareContainer,
  PageContainer,
  ScrollContainer,
  SafeAreaScreenContainer,
} from 'app/components/layout';
import { StackScreenProps } from '@react-navigation/stack';
import { UserRoutes } from 'types/navigation';
import { Keyboard } from 'react-native';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

const PhoneFormSchema = Yup.object().shape({
  country_code: Yup.string().required(i18n._(t`Country code is required`)),
  phone: Yup.number()
    .typeError(i18n._(t`Invalid phone number`))
    .required(i18n._(t`Phone is required`)),
  otp: Yup.number().typeError(i18n._(t`Only numeric value`)),
});

const initialValues = {
  phone: '',
  country_code: '',
  otp: '',
};

const PhoneForm = ({ navigation }: StackScreenProps<UserRoutes, 'PhoneForm'>) => {
  const user = useStoreState((s) => s.user.user);
  const fetchUser = useStoreActions((a) => a.user.fetch);
  const countries = useStoreState((s) => s.country.countries);
  const [showOtpForm, setOtpForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();

  const onResetPasswordError = (error: string) => {
    setIsSubmitting(false);
    setFormError(error);
    form.setFieldValue('otp', '');
  };

  const verifyPhone = (values: Partial<typeof initialValues>) => {
    API.post('me/verify/phone', values)
      .then(() => {
        setIsSubmitting(false);
        setOtpForm(true);
      })
      .catch(onResetPasswordError);
  };

  const verifyOtp = (values: typeof initialValues) => {
    API.post('me/verify/otp', values)
      .then(() => {
        fetchUser();
        navigation.goBack();
      })
      .catch(onResetPasswordError);
  };

  const reSend = (values: { country_code: string; phone: string }) => {
    setIsSubmitting(true);
    setFormError('');
    verifyPhone(values);
  };

  const submit = (values: typeof initialValues) => {
    setFormError('');
    setIsSubmitting(true);
    Keyboard.dismiss();
    if (values.otp) {
      verifyOtp(values);
    } else {
      verifyPhone(values);
    }
  };

  const form = useForm<typeof initialValues>({
    initialValues,
    submit,
    validationSchema: PhoneFormSchema,
  });

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <PageContainer mt={5} mb={10}>
            <Box my={4} />
            <Box>
              <Box px={1}>
                <Box mb={5} width="100%">
                  <Field
                    {...form.getInputFields('country_code')}
                    label={i18n._(t`Country Call Code`)}
                    type="select"
                    items={countries.map((country) => ({
                      label: `${country.name}  (${country.calling_code})` || '',
                      value: country.calling_code || '',
                      inputLabel: country.calling_code,
                    }))}
                  />
                </Box>

                <Box mb={5} width="100%">
                  <Field
                    {...form.getInputFields('phone')}
                    label="Phone Number"
                    textContentType="telephoneNumber"
                    keyboardType="phone-pad"
                  />
                </Box>

                {showOtpForm && !isSubmitting && (
                  <Box mb={2}>
                    <ButtonBase
                      onPress={() =>
                        reSend({
                          country_code: form.getInputFields('country_code').value,
                          phone: form.getInputFields('phone').value,
                        })
                      }
                    >
                      <Text color="blue" textAlign="right" textDecorationLine="underline">
                        <Trans>Resend OTP</Trans>
                      </Text>
                    </ButtonBase>
                  </Box>
                )}
                {showOtpForm && (
                  <Box mb={5} width="100%">
                    <Field {...form.getInputFields('otp')} label="OTP" keyboardType="phone-pad" />
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
                text={showOtpForm ? i18n._(t`SAVE`) : i18n._(t`SEND OTP`)}
                disabled={user.phone === form.getInputFields('phone').value}
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

export default PhoneForm;
