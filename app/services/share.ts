import { Share, ShareContent, ShareOptions } from 'react-native';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import envConstants from 'app/config';
import { ProductType } from 'types/resources/product';
import { LB } from 'common/constants';

type ArgumentTypes<F> = F extends (args: infer A) => void ? A : never;

const SHARE_MESSAGES = {
  product: ({ product, referralMsg }: { product: ProductType; referralMsg?: string }) => ({
    url: envConstants.WEB_APP_URL + product.name_slug,
    message: i18n._(
      t`Checkout ${product.name} at Novelship. ${referralMsg}${LB}${envConstants.WEB_APP_URL}${product.name_slug}`
    ),
    title: product.name,
  }),
  referral: ({
    referralCode,
    referralValue,
    countryShortcode,
  }: {
    referralCode: string;
    referralValue: string;
    countryShortcode: string;
  }) => ({
    url: `${envConstants.WEB_APP_URL}signup?referral_code=${referralCode}&source=${countryShortcode}`,
    message: i18n._(
      t`Get ${referralValue} off your first purchase when you sign up on Novelship using my referral code ${referralCode}${LB}${envConstants.WEB_APP_URL}signup?referral_code=${referralCode}&source=${countryShortcode}`
    ),
    title: i18n._(t`Referral`),
  }),
};

function share(
  type: keyof typeof SHARE_MESSAGES,
  data: ArgumentTypes<typeof SHARE_MESSAGES[typeof type]>
) {
  const shareContent: ShareContent = SHARE_MESSAGES[type](data as any);
  const shareOptions: ShareOptions = {
    dialogTitle: shareContent.title,
    subject: shareContent.title,
  };
  return Share.share(shareContent, shareOptions);
}

export default share;
