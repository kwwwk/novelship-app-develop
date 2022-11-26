import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import { ButtonBase, Text, Box } from 'app/components/base';
import { useStoreActions } from 'app/store';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import ErrorMessage from 'app/components/form/ErrorMessage';
import theme from 'app/styles/theme';
import AuthContext from './context';

const LoginOTP = () => {
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();

  const { loginValues, setLoginValues } = useContext(AuthContext);
  const login = useStoreActions((a) => a.user.login);

  const onLoginError = (error: string) => {
    setIsSubmitting(false);
    setFormError(error);
  };

  const resendOtp = () => {
    setFormError('');
    setLoginValues({ ...loginValues, csrf: '' });
    setCode('');
    submit('');
  };

  const submit = (otp: string) => {
    if (!/^[A-Z0-9]*$/.test(otp)) return setFormError(i18n._(t`Invalid verification code`));

    setIsSubmitting(true);

    login({ ...loginValues, otp })
      .then(({ otpSent, csrfToken }: { otpSent: boolean; csrfToken: string }) => {
        setFormError('');
        setIsSubmitting(false);
        if (otpSent && csrfToken) {
          setLoginValues({ ...loginValues, csrf: csrfToken });
          setSeconds(60);
        }
      })
      .catch(onLoginError);
  };

  const intervalRef = useRef<NodeJS.Timer>();
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      }
      if (seconds === 0) {
        clearInterval(intervalRef.current as NodeJS.Timer);
      }
    }, 1000);
    return () => clearInterval(intervalRef.current as NodeJS.Timer);
  });

  return (
    <Box mx={6}>
      <Text my={5} fontSize={3} fontFamily="bold">
        <Trans>INPUT THE VERIFICATION CODE</Trans>
      </Text>
      <Text fontSize={2}>
        <Trans>We have sent a verification code to</Trans>
      </Text>
      <Text fontSize={2} fontFamily="medium">
        {String(loginValues?.email)}
      </Text>

      <Box alignItems="center" my={8}>
        <OTPInputView
          code={code}
          pinCount={4}
          autoFocusOnLoad
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          codeInputFieldStyle={{
            ...styles.underlineStyleBase,
            borderColor: formError?.length ? theme.colors.red : theme.colors.gray5,
          }}
          style={{ width: '60%', height: 46 }}
          onCodeChanged={(_code) => setCode(_code)}
          onCodeFilled={(otp) => submit(otp)}
        />

        {isSubmitting ? (
          <Box mt={6}>
            <LoadingIndicator size="small" color={theme.colors.black2} />
          </Box>
        ) : (
          <>
            {!!formError?.length && (
              <Box center width={240}>
                <Text mt={5} fontSize={1} textAlign="center">
                  <ErrorMessage>{i18n._(formError)}</ErrorMessage>
                </Text>
              </Box>
            )}

            {seconds ? (
              <Text mt={5} fontSize={2} textAlign="center">
                <Trans>
                  Resend after <Text fontFamily="bold">{seconds}</Text> seconds
                </Trans>
              </Text>
            ) : (
              <ButtonBase disabled={isSubmitting} onPress={resendOtp}>
                <Text mt={5} color="blue" fontSize={2} fontFamily="bold">
                  <Trans>RESEND CODE</Trans>
                </Text>
              </ButtonBase>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 1,
    borderRadius: 4,
    color: theme.colors.black3,
  },
  underlineStyleHighLighted: {
    borderColor: theme.colors.black2,
  },
});

export default React.memo(LoginOTP);
