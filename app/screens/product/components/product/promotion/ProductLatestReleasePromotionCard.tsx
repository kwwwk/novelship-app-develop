import { ProductType } from 'types/resources/product';

import * as React from 'react';
import { Trans } from '@lingui/macro';

import { MIL_SECS_IN_DAY } from 'common/constants';
import { useStoreState } from 'app/store';
import { getSGTTime } from 'common/utils/time';
import { Text } from 'app/components/base';
import ProductSellPromotionBar from './ProductSellPromotionBar';

const ProductLatestReleasePromotionCard = ({ product, ...props }: { product: ProductType }) => {
  const latestReleaseSellerFees = useStoreState(
    (s) =>
      s.base.sellingFeePromotions &&
      s.base.sellingFeePromotions.find(
        (sfp) => sfp.product_collection && sfp.product_collection.slug === 'latest-release'
      )
  );
  const { selling_fee, listing_fee } = latestReleaseSellerFees || {
    selling_fee: 50,
    listing_fee: 25,
  };

  const todayDate = getSGTTime(); // @ts-ignore: override
  const dropDate = Number(getSGTTime(product.drop_date ? new Date(product.drop_date) : undefined));

  const sevenDaysAgo = Number(new Date(new Date(todayDate).setDate(todayDate.getDate() - 7)));
  const endTime = Math.abs(dropDate - sevenDaysAgo);
  // if dropDate is less than seven days ago date then always show 1
  const endDays = dropDate < sevenDaysAgo ? 1 : Math.ceil(endTime / MIL_SECS_IN_DAY);

  return (
    <ProductSellPromotionBar
      title={<Trans>LATEST RELEASE</Trans>}
      text={<Trans>Enjoy up to {selling_fee}% off seller fees</Trans>}
      sellingFeesDiscount={selling_fee}
      listingFeesDiscount={listing_fee}
      endDays={endDays}
      faqLink="latest_release"
      {...props}
    >
      <Text mt={2} mb={3} fontSize={1} textAlign="center" color="textSecondary">
        <Trans>Only sales and lists created within the next</Trans> {endDays}{' '}
        {endDays > 1 ? <Trans>days</Trans> : <Trans>day</Trans>}{' '}
        <Trans>will enjoy seller fee reductions</Trans>
      </Text>
    </ProductSellPromotionBar>
  );
};

export default ProductLatestReleasePromotionCard;
