import { RootRoutes, UserRoutes } from 'types/navigation';

import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { useQuery } from 'react-query';

import { TransactionBuyerType } from 'types/resources/transactionBuyer';
import { Anchor, Box, Button, ButtonBase, ImgixImage, Text } from 'app/components/base';
import {
  Footer,
  PageContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import ConfirmationTick from 'app/components/icons/ConfirmationTick';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { LB } from 'common/constants';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { StackNavigationProp } from '@react-navigation/stack';
import List from 'app/components/blocks/List';
import getFaqLink from 'common/constants/faq';

type TransactionRouteProp = RouteProp<UserRoutes, 'StoreInStorageConfirmed'>;
type ConfirmedNavigationProp = CompositeNavigationProp<
  StackNavigationProp<UserRoutes, 'PurchaseDetails' | 'StoreInStorageConfirmed'>,
  StackNavigationProp<RootRoutes, 'ProductStack'>
>;
const initialTransaction = {
  status: 'pending',
  size: '',
  buyer_country: {},
} as TransactionBuyerType;
const StoreInStorageConfirm = ({
  route,
  navigation,
}: {
  route: TransactionRouteProp;
  navigation: ConfirmedNavigationProp;
}) => {
  const id = route.params.sale_ref;

  const { data: transaction = initialTransaction } = useQuery<TransactionBuyerType>(
    [`me/sales/buying/${id}`],
    { initialData: initialTransaction }
  );
  const { $$ } = useCurrencyUtils();
  const transactionSpecs = [
    { label: i18n._(t`Size`), value: transaction.local_size || i18n._(t`One-Size`) },
    {
      label: i18n._(t`Product Price`),
      value: $$(transaction.offer_price_local, transaction.buyer_currency),
    },
  ];

  const navigateToProductHome = () => {
    navigation.popToTop();
    navigation.push('ProductStack', {
      screen: 'Product',
      slug: transaction.product.name_slug,
    });
  };
  if (!transaction?.id) return null;
  return (
    <SafeAreaScreenContainer>
      <ScrollContainer>
        <PageContainer mt={4}>
          <Box borderBottomWidth={1} borderBottomColor="dividerGray" pb={6}>
            <Box center>
              <ConfirmationTick />
              <Text fontFamily="bold" textTransform="uppercase" mt={3} fontSize={4}>
                <Trans>STORE IN NOVELSHIP STORAGE!</Trans>
              </Text>
            </Box>

            <Text mt={4} textAlign="center" fontSize={2}>
              {i18n._(
                t`You have successfully requested storage of your ${LB}product in Novelship Storage.`
              )}
              {LB}
              <Anchor
                to={getFaqLink('sell_from_storage')}
                fontSize={2}
                textDecorationLine="underline"
              >
                <Trans>Learn how you can sell from Storage</Trans>
              </Anchor>
            </Text>
          </Box>

          <Box mt={5}>
            <Text textAlign="center" fontFamily="bold" fontSize={3} mb={7}>
              <Trans>PURCHASE DETAILS</Trans>
            </Text>

            <ButtonBase onPress={() => navigateToProductHome()}>
              <ImgixImage src={transaction.product.image} height={64} />
            </ButtonBase>

            <Text mt={6} textAlign="center" fontFamily="bold" fontSize={3}>
              {transaction.product.name}
            </Text>
            {!!transaction.product.sku && (
              <Text textAlign="center" fontSize={2} color="gray3" fontFamily="medium" mt={2}>
                <Trans>SKU:</Trans> {transaction.product.sku}
              </Text>
            )}

            <Box my={6}>
              <List items={transactionSpecs} />
            </Box>
          </Box>
        </PageContainer>
      </ScrollContainer>
      <Footer>
        <Button
          variant="black"
          size="lg"
          text={i18n._(t`VIEW PURCHASE`)}
          onPress={() => navigation.replace('PurchaseDetails', { sale_ref: String(id) })}
        />
      </Footer>
    </SafeAreaScreenContainer>
  );
};

export default StoreInStorageConfirm;
