import React, { useState } from 'react';
import Clipboard from '@react-native-community/clipboard';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';

import { Box, Button, ButtonBase, Text } from 'app/components/base';
import Dialog from 'app/components/dialog/Dialog';
import { Input } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { useStoreActions, useStoreState } from 'app/store';
import API from 'common/api';
import { referralDiscount } from 'common/constants/referrals';
import { LB } from 'common/constants';
import Analytics from 'app/services/analytics';

const ReferralInputDialog = () => {
  const currency = useStoreState((s) => s.currency.current);
  const isOpen = useStoreState((s) => s.referralInputDialog.isOpen);
  const closeDialog = useStoreActions((a) => a.referralInputDialog.closeDialog);

  const [isSuccess, setIsSuccess] = useState(false);
  const [referralError, setReferralError] = useState('');
  const [referralInputValue, setReferralInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [copyText, setCopyText] = useState<string>('COPY CODE');
  const { $ } = useCurrencyUtils();

  const refereeDiscountValue = $(referralDiscount({ type: 'referee', currency }));

  const onClose = () => {
    setIsSuccess(false);
    setReferralInputValue('');
    closeDialog();
  };

  const submit = () => {
    setReferralError('');

    setIsSubmitting(true);
    API.post(`me/referral`, { referral_code: referralInputValue })
      .then(() => {
        setIsSuccess(true);
        Analytics.referralCodeApplied(referralInputValue);
      })
      .catch(setReferralError)
      .finally(() => setIsSubmitting(false));
  };

  const displayCode = 'WELCOMEFRIEND';

  return (
    <Dialog center p={5} width={340} bg="white" onClose={onClose} isOpen={isOpen} dismissable>
      <Box center p={2}>
        <Text textAlign="center" fontSize={4} fontFamily="bold">
          <Trans>WELCOME TO NOVELSHIP</Trans>{' '}
        </Text>

        {isSuccess ? (
          <Text textAlign="center" fontSize={2} mt={5} mb={3}>
            <Trans>
              We’re glad to have you onboard,{LB}enjoy {refereeDiscountValue} off your first
              purchase with us.
            </Trans>
          </Text>
        ) : (
          <Text textAlign="center" fontSize={2} mt={5} mb={3}>
            <Trans>
              Have a referral code?{LB}Enter to activate a {refereeDiscountValue} off your first
              purchase discount code.
            </Trans>
          </Text>
        )}
        {!isSuccess ? (
          <>
            <Box center flexDirection="row" width="90%" mt={5}>
              <Input
                placeholder={i18n._(t`Enter Referral Code`)}
                value={referralInputValue}
                onChangeText={(r) => {
                  setReferralInputValue(r);
                  setReferralError('');
                }}
              />
            </Box>
            <ErrorMessage mt={2}>{referralError}</ErrorMessage>
            <Box center width="100%" mt={5}>
              <Button
                width={300}
                text={i18n._(t`APPLY REFERRAL CODE`)}
                variant="white"
                onPress={submit}
                loading={isSubmitting}
              />
              <Box mt={4} />
              <Button
                width={300}
                text={i18n._(t`KEEP BROWSING`)}
                variant="black"
                onPress={onClose}
              />
            </Box>
          </>
        ) : (
          <Box center>
            <Box center mt={4} mb={2} py={3} px={8} bg="yellow" width="90%" borderRadius={4}>
              <Text fontFamily="bold" fontSize={3}>
                {displayCode}
              </Text>
            </Box>
            <ButtonBase
              onPress={() => {
                setCopyText('COPIED!');
                Clipboard.setString(displayCode);
              }}
            >
              <Text textDecorationLine="underline" fontSize={2} mt={2}>
                {copyText}
              </Text>
            </ButtonBase>
            <Box mt={7} />
            <Button width={300} text={i18n._(t`GOT IT`)} variant="black" onPress={onClose} />
          </Box>
        )}
      </Box>
    </Dialog>
  );
};
export default ReferralInputDialog;
