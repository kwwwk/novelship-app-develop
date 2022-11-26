import { StackScreenProps } from '@react-navigation/stack';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { UserRoutes } from 'types/navigation';
import { PayoutRequestType } from 'types/resources/payoutRequest';
import { Box, Text, ButtonBase } from 'app/components/base';
import {
  KeyboardAwareContainer,
  PageContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { useStoreState } from 'app/store';
import theme from 'app/styles/theme';
import { fieldToTitle } from 'common/utils/string';
import { toDate } from 'common/utils/time';
import { Linking } from 'react-native';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import LoadingScreen from 'app/components/misc/LoadingScreen';

const PayoutHistory: React.FC<StackScreenProps<UserRoutes, 'PayoutHistory'>> = () => {
  const currencyId = useStoreState((s) => s.currency.current.id);
  const { $$ } = useCurrencyUtils();

  const { results: payoutHistory, isLoading } = useAPIListFetch<PayoutRequestType>(
    'me/payout-requests',
    {
      filter: { currency_id: currencyId },
      page: { size: 50 },
    },
    { refetchOnScreenFocus: true }
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <PageContainer mt={2} mb={10}>
            <Box py={2}>
              {payoutHistory.length > 0 ? (
                payoutHistory.map((payout) => (
                  <Box
                    key={payout.id}
                    flexDirection="row"
                    justifyContent="space-between"
                    borderBottomWidth={1}
                    borderBottomColor="dividerGray"
                    mt={5}
                    pb={4}
                    px={1}
                  >
                    <Box>
                      <Box flexDirection="row" alignItems="center" mb={2}>
                        <Text fontSize={3} mr={1}>
                          {payout.request_type === 'crypto' ? (
                            <Trans>Crypto Payout</Trans>
                          ) : payout.request_type === 'requested' ? (
                            <Trans>Normal Payout</Trans>
                          ) : (
                            <Trans>Early Payout</Trans>
                          )}
                        </Text>
                        {payout.request_type === 'expedited_requested' && (
                          <Ionicon name="flash" size={16} color={theme.colors.textBlack} />
                        )}
                      </Box>
                      <Text color="textSecondary" fontSize={2}>
                        <Trans>Requested: {toDate(payout.created_at, 'DD MMM YYYY')}</Trans>
                      </Text>
                      <Text color="textSecondary" fontSize={2}>
                        <Trans>
                          Transfer date: {toDate(payout.expected_processing_date, 'DD MMM YYYY')}
                        </Trans>
                      </Text>
                    </Box>
                    <Box alignItems="flex-end" justifyContent="space-around">
                      <Text fontSize={3}>{i18n._(fieldToTitle(payout.status))}</Text>
                      <Text fontFamily="medium">{$$(payout.payout_amount)}</Text>
                    </Box>
                  </Box>
                ))
              ) : (
                <Text textAlign="center" mt={5} fontSize={2}>
                  <Trans>No requests found</Trans>
                </Text>
              )}

              <Box alignItems="center" mt={8} mb={10}>
                <Text fontSize={1} textAlign="center">
                  <Trans>Please contact our support if you have any queries.</Trans>
                </Text>
                <ButtonBase onPress={() => Linking.openURL('mailto:support@novelship.com')}>
                  <Text fontSize={2} color="blue" textAlign="center">
                    support@novelship.com
                  </Text>
                </ButtonBase>
              </Box>
            </Box>
          </PageContainer>
        </ScrollContainer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

export default PayoutHistory;
