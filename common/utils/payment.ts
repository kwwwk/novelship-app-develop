import { i18n } from '@lingui/core';
import { PaymentMethodEnumType } from 'types/resources/paymentMethod';

import { fieldToTitle } from './string';

const paymentMethodString = (paymentMethod?: string) =>
  i18n._(
    fieldToTitle(
      (paymentMethod || '')
        .replace('triple-a_', '')
        .replace('stripe_', '')
        .replace('rapyd_', '')
        .replace(/_:x:_.*/, '')
    )
  );

const cardString = (card: { brand: string; last4: string }) =>
  card && card.brand ? `${fieldToTitle(card.brand)} ${card.last4}` : '';

const cardImage = (card: { brand: string }) =>
  `partners/cards/${(card && card.brand && card.brand.toLowerCase()) || 'Unknown'}.png`;

export type PaymentRedirectResponseType = {
  ref: string;
  charge: {
    client_secret: string;
    payment_method: PaymentMethodEnumType;
    redirect: {
      url: string;
    };
  };
};

export { paymentMethodString, cardString, cardImage };
