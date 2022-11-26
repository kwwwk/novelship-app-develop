import { CurrencyType } from 'types/resources/currency';
import { CurrencyConstantType, CURRENCY_CONSTANTS } from './currency';

// Referrer -> referral giver
// Referee -> referral receiver

type refereeDiscountType = {
  [key: number]: { value: number; min_buy: number };
};
const refereeDiscount: refereeDiscountType = Object.values(CURRENCY_CONSTANTS).reduce(
  (a, c: CurrencyConstantType) => {
    a[c.id] = {
      value: c.refereeDiscountValue,
      min_buy: c.refereeDiscountMinBuy,
    };
    return a;
  },
  {} as refereeDiscountType
);

const referralDiscount = ({
  type,
  currency,
}: {
  type: 'referrer' | 'referee';
  currency: CurrencyType;
}) => {
  if (type === 'referrer') {
    return currency.referrer_promocode_value;
  }
  return refereeDiscount[currency.id] && refereeDiscount[currency.id].value;
};

export { referralDiscount, refereeDiscount };
