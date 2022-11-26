import { defaultPromocode, PromocodeType } from 'types/resources/promocode';
import { CurrencyType } from 'types/resources/currency';
import { ProductType } from 'types/resources/product';
import { UserType } from 'types/resources/user';

import React, { useState } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Trans } from '@lingui/macro';

import { isCampaignTime } from 'common/constants/campaign';
import { useStoreState } from 'app/store';
import { WINDOW_WIDTH } from 'common/constants';
import theme from 'app/styles/theme';

import ProductLatestReleasePromotionCard from './ProductLatestReleasePromotionCard';
import ProductSectionHeading from '../ProductSectionHeading';
import ProductPromocodeCard from './ProductPromocodeCard';

const ProductPromocodeList = ({ product }: { product: ProductType }) => {
  const allPromocodes: PromocodeType[] = useStoreState((s) => s.base.promocodes);
  const currentCurrency: CurrencyType = useStoreState((s) => s.currency.current);
  const user: UserType = useStoreState((s) => s.user.user);

  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  const promocodes = [];
  let i = 0;
  while (promocodes.length < 4 && i < allPromocodes.length) {
    const promocode = allPromocodes[i];

    const isApplicableCurrency = promocode.currency_id === currentCurrency.id;

    const isApplicableFirstTime =
      (promocode.first_purchase_only && user.firstTimePromocodeEligible) ||
      !promocode.first_purchase_only ||
      !user.id;

    const isApplicableCollection =
      product.collections.includes(promocode.collection) || !promocode.collection;

    const isApplicableClass = promocode.class === product.class || !promocode.class;

    if (
      isApplicableCurrency &&
      isApplicableFirstTime &&
      isApplicableCollection &&
      isApplicableClass
    ) {
      promocodes.push(promocode);
    }
    i += 1;
  }

  const hasLatestReleasePromotion =
    product.drop_date && product.collections.includes('latest-release');

  if (hasLatestReleasePromotion) {
    promocodes.unshift(defaultPromocode);
  }

  if (!hasLatestReleasePromotion && !promocodes.length && !isCampaignTime) {
    return null;
  }

  return (
    <>
      <ProductSectionHeading mx={6} mb={3} textAlign="center">
        <Trans>PROMOTIONS</Trans>
      </ProductSectionHeading>
      <Carousel
        data={promocodes}
        onSnapToItem={setCarouselIndex}
        sliderWidth={WINDOW_WIDTH}
        itemWidth={WINDOW_WIDTH}
        useScrollView
        decelerationRate={200}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        renderItem={({ item: promocode, index }) => {
          if (index === 0 && hasLatestReleasePromotion) {
            return <ProductLatestReleasePromotionCard product={product} />;
          }
          return <ProductPromocodeCard promocode={promocode} />;
        }}
      />
      <Pagination
        dotsLength={promocodes.length}
        activeDotIndex={carouselIndex}
        inactiveDotOpacity={0.5}
        inactiveDotScale={1}
        containerStyle={{ paddingBottom: 0, paddingTop: 16 }}
        dotContainerStyle={{ marginHorizontal: 2 }}
        dotStyle={{
          width: 8,
          height: 2,
          borderRadius: 0,
          marginHorizontal: 0,
          backgroundColor: theme.colors.textBlack,
        }}
      />
    </>
  );
};

export default ProductPromocodeList;
