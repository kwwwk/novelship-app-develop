import React from 'react';
import { Trans } from '@lingui/macro';

import { ImgixImage, Box, Text, Anchor, AnchorButton } from 'app/components/base';
import { ScrollContainer } from 'app/components/layout';
import { LB, WINDOW_HEIGHT } from 'common/constants';

const PayLaterDialog = ({
  shortcode,
  paymentMethod,
}: {
  shortcode: string;
  paymentMethod: string;
}) => (
  <Box width={340} backgroundColor="white">
    <ScrollContainer style={{ maxHeight: WINDOW_HEIGHT * 0.8 }}>
      {paymentMethod === 'paidy' ? (
        <AnchorButton to="https://paidy.com/landing/">
          <Box center>
            <ImgixImage src="partners/Paidy_Banner.png" width={360} height={160} />
          </Box>
        </AnchorButton>
      ) : (
        <Box center px={4}>
          <>
            <Box mb={1}>
              <ImgixImage src="partners/afterpay.png?trim=color" width={170} height={33} />
            </Box>
            <Text fontSize={3} fontFamily="bold" mb={4}>
              <Trans>
                Shop Now. Pay After
                {LB}
                Always interest-free
              </Trans>
            </Text>
            <Box center mb={3}>
              <ImgixImage src="icons/ap-icon.png" width={60} height={60} />
              <Text textAlign="center" fontSize={2}>
                <Trans>Select Afterpay at checkout</Trans>
              </Text>
            </Box>
            <Box center mb={3}>
              <ImgixImage src="icons/ap-signup.png" width={60} height={60} />
              <Text textAlign="center" fontSize={2}>
                <Trans>
                  Log into or create your Afterpay account,
                  {LB}
                  with instant approval decision
                </Trans>
              </Text>
            </Box>
            <Box center mb={4}>
              <ImgixImage src="icons/ap-4-instalment.png" width={60} height={60} />
              <Text textAlign="center" fontSize={2}>
                <Trans>
                  Your purchase will be split into 4 payments,
                  {LB}
                  payable every 2 weeks
                </Trans>
              </Text>
            </Box>
            <Box mb={2} borderTopWidth={1} borderTopColor="dividerGray" height={1} width="100%" />
            <Text textAlign="center" fontSize={1} my={3}>
              <Trans>
                All you need to apply is to have a debit or credit card, to be over 18 years of age,
                and to be resident of {shortcode === 'NZ' ? 'New Zealand' : 'Australia'}. Late fees
                and additional eligibility criteria apply. The first payment may be due at time of
                purchase. For complete terms{' '}
                <Anchor
                  fontSize={1}
                  textDecorationLine="underline"
                  to={`https://www.afterpay.com/en-${shortcode}/terms-of-service`}
                >
                  tap here
                </Anchor>
              </Trans>
            </Text>
          </>
        </Box>
      )}
    </ScrollContainer>
  </Box>
);

export default PayLaterDialog;
