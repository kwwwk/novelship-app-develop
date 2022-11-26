// @flow
import * as React from 'react';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { ButtonBase, Anchor, Text, Box } from 'app/components/base';
import getFaqLink, { FAQ_LINK_TYPES } from 'common/constants/faq';
import InfoDialog from 'app/components/dialog/InfoDialog';
import useToggle from 'app/hooks/useToggle';
import theme from 'app/styles/theme';

type Props = {
  title: string | any;
  text: string | any;
  endDays: number;
  sellingFeeFixed?: number;
  sellingFeesDiscount: number;
  listingFeesDiscount?: number;
  children: React.ReactNode;
  faqLink?: FAQ_LINK_TYPES;
};
const ProductPromotionBar = ({
  title,
  text,
  endDays,
  sellingFeesDiscount,
  listingFeesDiscount,
  sellingFeeFixed,
  faqLink,
  children,
  ...props
}: Props) => {
  const [isPromoInfoDialogOpen, togglePromoInfoDialog] = useToggle(false);

  return (
    <Box mt={3} px={6}>
      <ButtonBase onPress={togglePromoInfoDialog}>
        <Box
          justifyContent="space-between"
          flexDirection="row"
          alignItems="center"
          borderRadius={4}
          minHeight={64}
          bg="black3"
          px={4}
          py={2}
          {...props}
        >
          <Box pr={5}>
            <Text color="white" fontSize={3} fontFamily="bold">
              {title}
            </Text>

            <Box mt={1} alignItems="center" flexDirection="row">
              <Text color="white" fontSize={1}>
                {text}
              </Text>
              <Text ml={2}>
                <Ionicon name="information-circle" size={18} color={theme.colors.white} />
              </Text>
            </Box>
          </Box>

          <Box alignItems="flex-end">
            <Text color="white" fontSize={1}>
              {endDays > 1 ? <Trans>Ends In</Trans> : <Trans>Ends</Trans>}
            </Text>
            <Text mt={2} color="white" fontSize={1} fontFamily="bold">
              {endDays > 1 ? <Trans>{endDays} DAYS</Trans> : <Trans>TODAY</Trans>}
            </Text>
          </Box>
        </Box>
      </ButtonBase>

      <InfoDialog
        isOpen={isPromoInfoDialogOpen}
        onClose={togglePromoInfoDialog}
        buttonText={i18n._(t`GOT IT`)}
      >
        <Box flexDirection="column" p={2}>
          <Text textAlign="center" fontSize={3} fontFamily="bold">
            {title}
          </Text>

          {sellingFeesDiscount === listingFeesDiscount ? (
            <Box p={5}>
              <Text pb={3} fontSize={2} fontFamily="bold" textAlign="center">
                <Trans>Sell Now / Make a List:</Trans>
              </Text>
              <Text fontSize={2} textAlign="center">
                {(sellingFeeFixed && sellingFeeFixed >= 0) || sellingFeesDiscount === 100
                  ? `${sellingFeeFixed || 0}%`
                  : `${sellingFeesDiscount}% Off`}{' '}
                <Trans>Seller Fees</Trans>
              </Text>
            </Box>
          ) : (
            <Box p={5}>
              <Box pb={3} flexDirection="row" justifyContent="space-between">
                <Text fontSize={2}>
                  <Trans>Sell Now:</Trans>
                </Text>
                <Text fontSize={2}>
                  <Trans>{sellingFeesDiscount}% off seller fees</Trans>
                </Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Text fontSize={2}>
                  <Trans>Make A List:</Trans>
                </Text>
                <Text fontSize={2}>
                  <Trans>{listingFeesDiscount}% off seller fees</Trans>
                </Text>
              </Box>
            </Box>
          )}

          {children}

          {faqLink && (
            <Anchor
              textDecorationLine="underline"
              to={getFaqLink(faqLink)}
              textAlign="center"
              fontSize={1}
              my={3}
            >
              <Trans>Terms and conditions</Trans>
            </Anchor>
          )}
        </Box>
      </InfoDialog>
    </Box>
  );
};

export default ProductPromotionBar;
