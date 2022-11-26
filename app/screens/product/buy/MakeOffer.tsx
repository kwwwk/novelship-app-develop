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
import { Anchor, Button, Text, Box, ButtonBase } from 'app/components/base';
import { getHighLowOfferList } from 'common/utils/offerLists';
import { useStoreState } from 'app/store';
import { LB } from 'common/constants';
import getFaqLink from 'common/constants/faq';
import Analytics from 'app/services/analytics';
import theme from 'app/styles/theme';

import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { isCurrentDateInRangeSG } from 'common/utils/time';
import ProductCheckoutContext from '../context';
import HighestOfferLowestList from '../components/common/HighestOfferLowestList';
import ProductImageHeader from '../components/common/ProductImageHeader';
import ExpirationSelect from '../components/common/ExpirationSelect';
import DeleteOfferList from '../components/common/DeleteOfferList';
import PriceInput from '../components/common/PriceInput';
import LastSalePrices from '../components/common/LastSalePrices/index';

type MakeOfferNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'MakeOffer'>,
  StackNavigationProp<RootRoutes, 'AuthStack'>
>;

type MakeOfferRouteProp = RouteProp<ProductRoutes, 'MakeOffer'>;

const MakeOffer = ({
  navigation,
  route,
}: {
  navigation: MakeOfferNavigationProp;
  route: MakeOfferRouteProp;
}) => {
  const {
    product,
    highLowOfferLists,
    refetchOfferLists,
    buy: { buy, offerPrice, expiration, setExpiration },
  } = useContext(ProductCheckoutContext);

  const currency = useStoreState((s) => s.currency.current);
  const currentCountryShortCode = useStoreState((s) => s.country.current.shortcode);
  const userId = useStoreState((s) => s.user.user.id);

  const [price, setPrice] = useState<number>();

  const { $ } = useCurrencyUtils();

  const { highestOfferPrice, lowestList, lowestListPrice } = getHighLowOfferList(
    highLowOfferLists,
    buy.size
  );

  let canProceed = true;

  const offerView = {
    proceedMsg: i18n._(t`REVIEW OFFER`),
    login: i18n._(t`LOGIN TO OFFER`),
    guideLink: getFaqLink('offer_guide'),
  };
  const buyView = {
    proceedMsg: i18n._(t`REVIEW PURCHASE`),
    login: i18n._(t`LOGIN TO BUY`),
    guideLink: getFaqLink('buyers_guide'),
  };

  const isBuy = lowestListPrice <= (price || 0);
  let view = isBuy ? buyView : offerView;

  let offerMsg = '';
  const offerMsgLink = () => {
    if (isBuy) {
      Analytics.buyOfferConfirm(buy, product, 'Purchase', 'Review');
      return navigation.push('BuyReview', { offer_list_id: lowestList.id });
    }
    return {};
  };
  let offerMsgColor: keyof typeof theme.colors = 'gray2';
  const isMassOfferCampaign =
    isCurrentDateInRangeSG(new Date(2022, 6, 21), new Date(2022, 7, 5)) &&
    ['SG', 'AU', 'NZ', 'MY', 'TW'].includes(currentCountryShortCode);
  if (isBuy) {
    offerMsg = i18n._(t`You are about to buy the Lowest List.${LB}Head to Buy now!`);
    offerMsgColor = 'green';
    view = buyView;
  } else if (!price || price < currency.min_offer_price) {
    offerMsg = i18n._(t`Minimum offer price is ${currency.min_offer_price}`);
    canProceed = false;
  } else if (price % currency.offer_step !== 0) {
    offerMsg = i18n._(t`Offer price should be in multiple of ${currency.offer_step}`);
    offerMsgColor = `red`;
    canProceed = false;
  } else if (price < highestOfferPrice) {
    offerMsg = isMassOfferCampaign
      ? i18n._(t`You are not the Highest Offer.${LB}Use code: 15OFFER for $15 / MYR 45 Off`)
      : i18n._(
          t`You are not the Highest Offer.${LB}The highest offer is ${$(
            highestOfferPrice
          )} - Offer now!`
        );
    offerMsgColor = 'red';
  } else if (price === highestOfferPrice) {
    offerMsgColor = 'orange';
    offerMsg = isMassOfferCampaign
      ? i18n._(t`Your offer matches the Highest Offer.${LB}Use code: SLASH25 for $25 / MYR 75 Off`)
      : i18n._(
          t`Your offer matches the Highest Offer.${LB}Offer higher to become the highest offer!`
        );
  } else if (price > highestOfferPrice || !highestOfferPrice) {
    offerMsg = i18n._(
      t`You are about to be the Highest Offer.${LB}Complete your offer to become the highest offer!`
    );
    offerMsgColor = 'green';
  }

  const goToNextPage = () => {
    if (!userId) {
      return navigation.navigate('AuthStack', { screen: 'SignUp' });
    }
    Analytics.buyOfferConfirm(buy, product, isBuy ? 'Purchase' : 'Offer', 'Review', {
      ...(isBuy ? {} : { 'Product Price': price }),
    });
    if (isBuy) {
      return navigation.replace('BuyReview', { offer_list_id: lowestList.id });
    }
    return navigation.navigate('BuyReview', {
      ...route.params,
      price,
      expiration,
    });
  };

  useEffect(() => {
    if (!price && offerPrice) {
      setPrice(offerPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerPrice]);

  useEffect(() => {
    navigation.setOptions(
      isBuy
        ? { headerTitle: i18n._(t`BUY NOW`) }
        : { headerTitle: route.params.edit ? i18n._(t`UPDATE OFFER`) : i18n._(t`MAKE OFFER`) }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBuy]);

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
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
            <ProductImageHeader product={product} size={buy.local_size} my={2} />

            <Box center mb={3}>
              <Text mb={1} fontFamily="bold" fontSize={3}>
                <Trans>YOUR OFFER ({currency.symbol})</Trans>
              </Text>
              <PriceInput
                placeholder={String(currency.min_offer_price)}
                min={currency.min_offer_price}
                step={currency.offer_step}
                value={price}
                onChangeText={(p) => setPrice(parseInt(p))}
              />
              <ButtonBase onPress={offerMsgLink}>
                <Box mt={2}>
                  <Text textAlign="center" color={offerMsgColor} fontSize={2}>
                    {offerMsg}
                  </Text>
                </Box>
              </ButtonBase>
            </Box>

            <HighestOfferLowestList
              mode="offer"
              price={price}
              highestOfferPrice={highestOfferPrice}
              lowestListPrice={lowestListPrice}
              setPrice={setPrice}
            />

            <Box center py={2}>
              <Text mt={7} mb={3} fontSize={3} fontFamily="bold">
                <Trans>OFFER EXPIRATION</Trans>
              </Text>
              <ExpirationSelect
                selected={expiration}
                onSelect={setExpiration}
                expirationDays={[7, 14, 30]}
              />
            </Box>

            <Box center mt={4}>
              <Text textAlign="center" color="textSecondary" fontSize={1}>
                <Trans>You won't be charged until a seller has accepted your offer.</Trans>
              </Text>
              <Text textAlign="center" color="textSecondary" fontSize={1}>
                <Trans>You can enter discount promocode on next step.</Trans>
              </Text>
            </Box>

            <Box mt={7}>
              <LastSalePrices isBuy size={buy.size} />
            </Box>

            {buy.isEdit && (
              <DeleteOfferList
                refetch={refetchOfferLists}
                offerList={buy}
                buttonMode="button-text"
              />
            )}
          </PageContainer>
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

export default MakeOffer;
