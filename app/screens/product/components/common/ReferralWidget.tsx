import { UserType } from 'types/resources/user';

import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { BoxProps } from 'app/components/base/Box';
import { Box, Text, Anchor, Button } from 'app/components/base';
import getFaqLink from 'common/constants/faq';
import { referralDiscount } from 'common/constants/referrals';
import theme from 'app/styles/theme';
import share from 'app/services/share';
import { useStoreState } from 'app/store';
import ReferralGift from 'app/components/icons/ReferralGift';
import HintDialog from 'app/components/dialog/HintDialog';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Analytics from 'app/services/analytics';

const ReferralWidget = ({ user, ...props }: { user: UserType } & BoxProps) => {
  const countryShortcode = useStoreState((s) => s.country.current.shortcode);
  const currency = useStoreState((s) => s.currency.current);
  const { $ } = useCurrencyUtils();

  const referrerDiscountValue = $(referralDiscount({ type: 'referrer', currency }));
  const refereeDiscountValue = $(referralDiscount({ type: 'referee', currency }));

  const shareReferral = () => {
    share('referral', {
      referralCode: user.referral_code,
      referralValue: refereeDiscountValue,
      countryShortcode,
    });
    Analytics.referralShare();
  };

  return (
    <Box
      center
      backgroundColor="yellow"
      width="100%"
      px={4}
      py={3}
      borderRadius={4}
      flexDirection="row"
      {...props}
    >
      <Box width="25%" height={70} p={2}>
        <ReferralGift />
      </Box>
      <Box ml={2} width="75%" px={2} py={1}>
        <Text fontSize={4} fontFamily="bold">
          <Trans>EARN {referrerDiscountValue}</Trans>
        </Text>
        <HintDialog
          hintContent={
            <Text fontSize={2} fontFamily="medium" mt={1}>
              <Trans>FOR EVERY FRIEND YOU INVITE TO NOVELSHIP</Trans>{' '}
              <Ionicon name="information-circle" size={20} color={theme.colors.textBlack} />
            </Text>
          }
        >
          <Box center px={2}>
            <Text fontSize={4} fontFamily="bold">
              <Trans>HOW DOES REFFERAL WORK?</Trans>
            </Text>
            <ReferralStep
              step={1}
              description={i18n._(t`Invite your friends to sign up for Novelship by sharing your unique referral link with
          them.`)}
            />
            <ReferralStep step={2} description={i18n._(t`Encourage them to make a purchase.`)} />
            <ReferralStep
              step={3}
              description={i18n._(
                t`Receive your referral bonus voucher after they have completed their first purchase.`
              )}
            />
            <Anchor
              to={getFaqLink('referral')}
              textDecorationLine="underline"
              fontSize={2}
              mt={4}
              mb={2}
            >
              <Trans>Terms and conditions</Trans>
            </Anchor>
          </Box>
        </HintDialog>

        <Anchor
          textDecorationLine="underline"
          to={getFaqLink('referral')}
          fontSize={1}
          mt={3}
          mb={4}
        >
          <Trans>Terms and conditions</Trans>
        </Anchor>
        <Button
          variant="white"
          style={{ backgroundColor: 'transparent' }}
          onPress={shareReferral}
          text={i18n._(t`SHARE`)}
          size="sm"
        />
      </Box>
    </Box>
  );
};

const ReferralStep = ({ step, description }: { step: number; description: string }) => (
  <Box center mt={4}>
    <Text fontSize={3} fontFamily="medium">
      {i18n._(t`Step ${step}:`)}
    </Text>
    <Text textAlign="center" fontSize={2}>
      {description}
    </Text>
  </Box>
);

export default ReferralWidget;
