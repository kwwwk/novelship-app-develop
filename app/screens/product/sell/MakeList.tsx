import { ProductRoutes, RootRoutes } from 'types/navigation';

import React, { useContext, useEffect, useState } from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

import {
  SafeAreaScreenContainer,
  KeyboardAwareContainer,
  ScrollContainer,
  PageContainer,
  Footer,
} from 'app/components/layout';
import { Anchor, Button, Text, Box } from 'app/components/base';
import { getHighLowOfferList } from 'common/utils/offerLists';
import { useStoreState } from 'app/store';
import { LB } from 'common/constants';
import SellFromStorageTicker from 'app/screens/user/components/SellFromStorageTicker';
import getFaqLink from 'common/constants/faq';
import Analytics from 'app/services/analytics';
import theme from 'app/styles/theme';

import ProductCheckoutContext from '../context';
import HighestOfferLowestList from '../components/common/HighestOfferLowestList';
import ProductImageHeader from '../components/common/ProductImageHeader';
import ExpirationSelect from '../components/common/ExpirationSelect';
import DeleteOfferList from '../components/common/DeleteOfferList';
import PriceInput from '../components/common/PriceInput';
import LastSalePrices from '../components/common/LastSalePrices/index';

type MakeListNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'MakeList'>,
  StackNavigationProp<RootRoutes, 'AuthStack'>
>;

type MakeListRouteProp = RouteProp<ProductRoutes, 'MakeList'>;

const MakeList = ({
  navigation,
  route,
}: {
  navigation: MakeListNavigationProp;
  route: MakeListRouteProp;
}) => {
  const { sale_storage_ref } = route.params;
  const {
    product,
    highLowOfferLists,
    refetchOfferLists,
    sell: { sell, listPrice, expiration, setExpiration },
  } = useContext(ProductCheckoutContext);

  const currency = useStoreState((s) => s.currency.current);
  const userId = useStoreState((s) => s.user.user.id);
  const user = useStoreState((s) => s.user.user);

  const [price, setPrice] = useState<number>();

  const { highestOfferPrice, highestOffer, lowestListPrice } = getHighLowOfferList(
    highLowOfferLists,
    sell.size
  );

  let canProceed = true;

  const listView = {
    proceedMsg: i18n._(t`REVIEW LIST`),
    login: i18n._(t`LOGIN TO LIST`),
    guideLink: getFaqLink('listing_guide'),
  };
  const sellView = {
    proceedMsg: i18n._(t`REVIEW SALE`),
    login: i18n._(t`LOGIN TO SELL`),
    guideLink: getFaqLink('sellers_guide'),
  };

  const isSell = highestOfferPrice >= (price || 0);
  let view = isSell ? sellView : listView;

  let listMsg = '';
  let listMsgColor: keyof typeof theme.colors = 'gray2';

  if (isSell) {
    listMsg = i18n._(
      t`You are about to Sell at the Highest Offer.${LB}You may raise the price to submit a new list.`
    );
    listMsgColor = `blue`;
    view = sellView;
  } else if (!price || price < currency.min_list_price) {
    listMsg = i18n._(t`Minimum list price is ${currency.min_list_price}`);
    canProceed = false;
  } else if (price % currency.list_step !== 0) {
    listMsg = i18n._(t`List price should be in multiple of ${currency.list_step}`);
    listMsgColor = `red`;
    canProceed = false;
  } else if (price > lowestListPrice) {
    listMsg = i18n._(t`You are not the Lowest List`);
    listMsgColor = `red`;
  } else if (price === lowestListPrice) {
    listMsgColor = `orange`;
    listMsg = i18n._(
      t`You are matched with the Lowest List.${LB}The List created first will be sold first.`
    );
  } else if (price < lowestListPrice || !lowestListPrice) {
    listMsg = i18n._(t`You are about to be the Lowest List.`);
    listMsgColor = 'green';
  }

  const goToNextPage = () => {
    if (!userId) {
      return navigation.navigate('AuthStack', { screen: 'SignUp' });
    }
    Analytics.sellListConfirm(sell, product, user, isSell ? 'Sale' : 'List', 'Review', {
      'Product Price': isSell ? highestOfferPrice : price,
      Size: sell.size,
    });

    if (isSell) {
      return navigation.replace('SellReview', { offer_list_id: highestOffer.id, sale_storage_ref });
    }
    return navigation.navigate('SellReview', {
      ...route.params,
      price,
      expiration,
    });
  };

  useEffect(() => {
    if (!price && listPrice) {
      setPrice(listPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPrice]);

  useEffect(() => {
    navigation.setOptions(
      isSell
        ? { headerTitle: i18n._(t`SELL NOW`) }
        : { headerTitle: route.params.edit ? i18n._(t`UPDATE LIST`) : i18n._(t`MAKE LIST`) }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSell]);

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          {sale_storage_ref && <SellFromStorageTicker />}
          <PageContainer mt={4}>
            <Anchor
              to={view.guideLink}
              fontSize={2}
              color="blue"
              fontFamily="bold"
              textDecorationLine="underline"
            >
              <Trans>HOW DOES IT WORK?</Trans>
            </Anchor>
            <ProductImageHeader product={product} size={sell.local_size} my={2} />

            <Box center mb={3}>
              <Text mb={1} fontFamily="bold" fontSize={3}>
                <Trans>YOUR LIST ({currency.symbol})</Trans>
              </Text>
              <PriceInput
                placeholder={String(currency.min_list_price)}
                min={currency.min_list_price}
                step={currency.list_step}
                value={price}
                onChangeText={(p) => setPrice(parseInt(p))}
              />
              {/* <Box mt={5} p={1} mb={1} bg="gray5" minWidth={200} borderRadius={2}>
                <Text>Estimated Payout: {$$(sell.totalPrice > 0 ? sell.totalPrice : 0)}</Text>
              </Box> */}
              <Box mt={2} height={42}>
                <Text textAlign="center" color={listMsgColor} fontSize={2}>
                  {listMsg}
                </Text>
              </Box>
            </Box>

            <HighestOfferLowestList
              mode="list"
              price={price}
              highestOfferPrice={highestOfferPrice}
              lowestListPrice={lowestListPrice}
              setPrice={setPrice}
            />

            <Box center py={2}>
              <Text mt={7} mb={3} fontSize={3} fontFamily="bold">
                <Trans>LIST EXPIRATION</Trans>
              </Text>
              <ExpirationSelect
                selected={expiration}
                onSelect={setExpiration}
                expirationDays={[7, 14, 30]}
              />
            </Box>

            <Box mt={7}>
              <LastSalePrices isBuy={false} size={sell.size} />
            </Box>
          </PageContainer>

          {sell.isEdit && (
            <DeleteOfferList
              refetch={refetchOfferLists}
              offerList={sell}
              buttonMode="button-text"
            />
          )}
        </ScrollContainer>

        <Footer>
          <Button
            variant="black"
            size="lg"
            text={userId ? view.proceedMsg : view.login}
            disabled={!canProceed}
            onPress={goToNextPage}
          />
        </Footer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

export default MakeList;
