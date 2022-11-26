import { defaultOfferList, OfferListType } from 'types/resources/offerList';
import { ProductRoutes, RootRoutes } from 'types/navigation';
import { TransactionType } from 'types/resources/transaction';

import React, { useContext, useEffect } from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from 'react-query';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

import {
  Footer,
  PageContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import { useStoreState } from 'app/store';
import { Box, ImgixImage, Text, Button, ButtonBase } from 'app/components/base';
import { expireIn } from 'common/utils/time';
import { LB } from 'common/constants';
import AppStoreReviewPrompt from 'app/services/appStoreReviewPrompt';
import ConfirmationTick from 'app/components/icons/ConfirmationTick';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';

import ProductCheckoutContext from '../context';
import ConfirmedPageWidgets from '../components/common/ConfirmedPageWidgets';
import ListItem from '../components/common/ListItem';

type ConfirmedRouteProp = RouteProp<ProductRoutes, 'ConfirmedList' | 'ConfirmedSale'>;
type ConfirmedNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'ConfirmedList' | 'ConfirmedSale'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

const SellListConfirmed = ({
  navigation,
  route,
}: {
  navigation: ConfirmedNavigationProp;
  route: ConfirmedRouteProp;
}) => {
  const mode = route.name.split('Confirmed')[1] as 'Sale' | 'Consignment' | 'List';
  const isSellOrConsign = ['Consignment', 'Sale'].includes(mode);
  const { id } = route.params;

  const { product } = useContext(ProductCheckoutContext);
  const sellerType = useStoreState((s) => s.user.user.seller_type);
  const { $$: _$$ } = useCurrencyUtils();

  const { data: item = defaultOfferList } = useQuery<OfferListType>( // @fixme: better typing
    [`me/${isSellOrConsign ? 'sales/selling' : 'offer-lists'}/${id}`],
    { initialData: defaultOfferList }
  );

  const currency = isSellOrConsign
    ? (item as unknown as TransactionType).seller_currency
    : item.currency;
  const $$ = (input: number) => _$$(input, currency);

  useEffect(() => {
    AppStoreReviewPrompt(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToProductHome = () => {
    navigation.popToTop();
    navigation.navigate('Product');
  };

  return (
    <SafeAreaScreenContainer>
      <ScrollContainer>
        <PageContainer mt={4}>
          <Box borderBottomWidth={1} borderBottomColor="dividerGray" pb={4}>
            <Box center>
              <ConfirmationTick />
              <Text fontFamily="bold" textTransform="uppercase" mt={2} fontSize={4}>
                <Trans>Congratulations!</Trans>
              </Text>
            </Box>

            <Text textAlign="center" fontSize={2}>
              {mode === 'List' && (
                <Trans>
                  Your list is confirmed.{LB}Now sit tight and wait for a buyer to accept your list
                </Trans>
              )}
              {mode === 'Sale' && (
                <Trans>Your Sale is confirmed.{LB}Please prepare to ship out your product</Trans>
              )}
              {mode === 'Consignment' && (
                <Trans>
                  Your Consignment is confirmed.{LB}Please prepare to ship out your product
                </Trans>
              )}
            </Text>

            <ConfirmedPageWidgets
              mode={mode === 'List' ? 'list' : 'sell'}
              navigation={navigation}
            />
          </Box>

          <Box mt={5}>
            <Text
              textTransform="uppercase"
              textAlign="center"
              fontFamily="bold"
              fontSize={4}
              mb={7}
            >
              {mode === 'List' ? (
                <Trans>LIST DETAILS</Trans>
              ) : mode === 'Consignment' ? (
                <Trans>CONSIGNMENT DETAILS</Trans>
              ) : (
                <Trans>SALE DETAILS</Trans>
              )}
            </Text>

            <ButtonBase onPress={() => navigateToProductHome()}>
              <ImgixImage src={product.image} height={64} />
            </ButtonBase>

            <Text
              mt={6}
              textAlign="center"
              fontFamily="bold"
              textTransform="uppercase"
              fontSize={3}
            >
              {product.name}
            </Text>

            <Box my={6}>
              {!product.is_one_size && (
                <ListItem>
                  <Text fontFamily="medium">
                    <Trans>Size</Trans>
                  </Text>
                  <Text fontFamily="medium">{item.local_size}</Text>
                </ListItem>
              )}
              <ListItem>
                <Text fontFamily="medium">
                  <Trans>Authenticity</Trans>
                </Text>
                <Text fontFamily="medium">
                  <Trans>100% Certified Authentic</Trans>
                </Text>
              </ListItem>
              <ListItem>
                <Text fontFamily="medium">
                  <Trans>Condition</Trans>
                </Text>
                <Text fontFamily="medium">
                  <Trans>Brand New</Trans>
                </Text>
              </ListItem>
              {isSellOrConsign && (
                <ListItem>
                  <Text fontFamily="medium">
                    <Trans>Ship within</Trans>
                  </Text>
                  <Text fontFamily="medium">
                    <Trans>2 Business Days</Trans>
                  </Text>
                </ListItem>
              )}

              {!!item.expired_at && (
                <ListItem>
                  <Text fontFamily="medium">
                    <Trans>Expiration</Trans>
                  </Text>
                  <Text fontFamily="medium">{expireIn(item.expired_at)}</Text>
                </ListItem>
              )}
              {mode === 'List' && (
                <ListItem>
                  <Text fontFamily="bold">
                    <Trans>List Price</Trans>
                  </Text>
                  <Text fontFamily="bold">{$$(item.local_price)}</Text>
                </ListItem>
              )}
              {mode === 'Sale' && (
                <ListItem>
                  <Text fontFamily="bold">
                    <Trans>Total Payout</Trans>
                  </Text>
                  {/* @ts-ignore ignore */}
                  <Text fontFamily="bold">{$$(item.payout_amount_local)}</Text>
                </ListItem>
              )}
            </Box>
            <Button
              variant="white"
              size="lg"
              text={i18n._(t`MAKE ANOTHER LIST`)}
              onPress={() => navigateToProductHome()}
            />
          </Box>
        </PageContainer>
      </ScrollContainer>
      <Footer>
        <Button
          variant="black"
          size="lg"
          text={` ${isSellOrConsign ? i18n._(t`VIEW SALES`) : i18n._(t`VIEW MY LISTS`)}`}
          onPress={() =>
            navigation.replace(
              'UserStack',
              isSellOrConsign
                ? sellerType === 'power-seller'
                  ? { screen: 'Selling', params: { screen: 'ConfirmedSales' } }
                  : { screen: 'SaleDetails', params: { sale_ref: String(id) } }
                : { screen: 'Selling', params: { screen: 'Lists' } }
            )
          }
        />
      </Footer>
    </SafeAreaScreenContainer>
  );
};

export default SellListConfirmed;
