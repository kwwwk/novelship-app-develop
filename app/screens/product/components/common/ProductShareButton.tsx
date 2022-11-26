import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import theme from 'app/styles/theme';
import { useStoreState } from 'app/store';
import { ProductType } from 'types/resources/product';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { ButtonBase } from 'app/components/base';
import { referralDiscount } from 'common/constants/referrals';
import share from 'app/services/share';
import Analytics from 'app/services/analytics';

const ProductShareButton = ({ product }: { product: ProductType }) => {
  const user = useStoreState((s) => s.user.user);
  const currency = useStoreState((s) => s.currency.current);

  const { $ } = useCurrencyUtils();

  const refereeDiscountValue = $(referralDiscount({ type: 'referee', currency }));

  const shareProduct = () => {
    share('product', { product, referralMsg });
    Analytics.productShare(product);
  };

  const referralMsg = user.referral_code
    ? i18n._(
        t`Sign up with my referral code ${user.referral_code} for ${refereeDiscountValue} off your first purchase.`
      )
    : '';

  return (
    <ButtonBase
      onPress={shareProduct}
      android_ripple={{ color: theme.colors.white, borderless: true }}
    >
      <Ionicon
        name="ios-share-social"
        size={theme.constants.HEADER_ICON_SIZE}
        color={theme.colors.white}
      />
    </ButtonBase>
  );
};

export default ProductShareButton;
