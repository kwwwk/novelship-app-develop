import { defaultPromocode, PromocodeType } from 'types/resources/promocode';
import Clipboard from '@react-native-community/clipboard';
import React, { useState } from 'react';
import { Box, Button, Text } from 'app/components/base';
import { ScrollContainer } from 'app/components/layout';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { useStoreState } from 'app/store';
import { refereeDiscount } from 'common/constants/referrals';
import { getWelcomePromo, welcomePromocodeValues } from 'common/constants/welcomePromo';
import { toDate } from 'common/utils/time';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';

const promocodesParams = {
  page: { size: 100, number: 0 },
  filter: {
    'end_date:gte': new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

const TableContent = [
  { title: t`Promocode` },
  { title: t`Description` },
  { title: t`Expiry` },
  { title: t`Discount` },
  { title: t`Min. Spend` },
  { title: t`Applicable For` },
];

const PromoCodeTable = () => {
  const user = useStoreState((s) => s.user.user);
  const currencyId = useStoreState((s) => s.currency.current.id);
  const country = useStoreState((s) => s.country.current);
  const { $ } = useCurrencyUtils();

  const [copyButtonIndex, setCopyButtonIndex] = useState<number>();
  const { value: welcomeDiscount, code: welcomeCode } = getWelcomePromo(country.shortcode);

  const { results: _promocodes, isLoading } = useAPIListFetch<PromocodeType>(
    'me/promocodes',
    {
      ...promocodesParams,
      filter: {
        ...promocodesParams.filter,
        currency_id: currencyId,
      },
    },
    { refetchOnScreenFocus: true }
  );

  const promocodes = [..._promocodes];

  if (user.refereeEligible) {
    promocodes.unshift({
      ...defaultPromocode,
      code: 'WELCOMEFRIEND',
      value: refereeDiscount[currencyId].value,
      min_buy: refereeDiscount[currencyId].min_buy,
      description: 'Referral Signup',
      end_date: '2024-12-31T00:00:00.000Z',
    });
  }

  if (user.firstTimePromocodeEligible && welcomeCode) {
    promocodes.unshift({
      ...defaultPromocode,
      code: welcomeCode,
      value: welcomePromocodeValues[country.shortcode].value,
      min_buy: welcomePromocodeValues[country.shortcode].min_buy,
      description: i18n._(t`Welcome Offer: Up to ${welcomeDiscount} off`),
      end_date: '2043-07-31T20:54:40.000Z',
    });
  }

  return (
    <ScrollContainer horizontal>
      <Box>
        <Box bg="gray6" height={40} flexDirection="row" justifyContent="space-between">
          {TableContent.map((content, index) => (
            <Box key={index} pl={5} width={index === 0 ? 160 : 140}>
              <Text lineHeight={40} fontFamily="medium">
                {i18n._(content.title)}
              </Text>
            </Box>
          ))}
        </Box>

        <ScrollContainer>
          {isLoading ? (
            <Box mt={5} ml={5} alignItems="flex-start">
              <LoadingIndicator />
            </Box>
          ) : promocodes.length > 0 ? (
            promocodes.map((promocode, index) => (
              <React.Fragment key={promocode.id}>
                <Box flexDirection="row" mt={4} mb={4}>
                  <Box pl={5} width={160}>
                    <Text fontSize={2} fontFamily="medium" lineHeight={40}>
                      {promocode.code}
                    </Text>

                    <Button
                      variant="white"
                      size="xs"
                      width={60}
                      onPress={() => {
                        setCopyButtonIndex(index);
                        Clipboard.setString(promocode.code);
                      }}
                      text={index === copyButtonIndex ? i18n._(t`COPIED`) : i18n._(t`COPY`)}
                    />
                  </Box>

                  <Box pl={5} width={140} justifyContent="center">
                    <Text fontSize={2}>
                      {promocode.description || `${$(promocode.value)} ${i18n._(t`Promocode`)}`}
                    </Text>
                  </Box>

                  <Box pl={5} width={140} justifyContent="center">
                    <Text fontSize={2}>{toDate(promocode.end_date)}</Text>
                  </Box>

                  <Box pl={5} width={140} justifyContent="center">
                    <Text fontSize={2}>
                      {promocode.is_percentage_discount
                        ? `${promocode.value}%`
                        : $(promocode.value)}
                    </Text>
                  </Box>

                  <Box pl={5} width={140} justifyContent="center">
                    <Text fontSize={2}>{promocode.min_buy ? $(promocode.min_buy) : '-'}</Text>
                  </Box>

                  <Box pl={5} width={140} justifyContent="center">
                    <Text fontSize={2} textTransform="uppercase">
                      {promocode.class ? i18n._(promocode?.class) : '-'}
                    </Text>
                  </Box>
                </Box>
                <Box height={1} bg="dividerGray" />
              </React.Fragment>
            ))
          ) : (
            <Text mt={5} ml={5} fontSize={2}>
              <Trans>No promocodes available</Trans>
            </Text>
          )}
          <Box my={10} />
        </ScrollContainer>
      </Box>
    </ScrollContainer>
  );
};

export default PromoCodeTable;
