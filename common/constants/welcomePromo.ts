import { toCurrencyString } from 'common/utils/currency';

// First time purchase only promocodes
const welcomePromocodeValues: { [key: string]: { value: number; min_buy: number; code: string } } =
  {
    SG: { value: 20, min_buy: 150, code: 'WELCOMESG' },
    AU: { value: 20, min_buy: 150, code: 'WELCOMEAU' },
    NZ: { value: 20, min_buy: 150, code: 'WELCOMENZ' },
    TW: { value: 400, min_buy: 3000, code: 'NSCREW400' },
    JP: { value: 1670, min_buy: 12500, code: 'WELCOMEJP' },
  };

const getWelcomePromo = (shortcode: string) => {
  const promoCodeDetails = { value: '', code: '' };
  if (Object.keys(welcomePromocodeValues).includes(shortcode)) {
    promoCodeDetails.value = toCurrencyString(welcomePromocodeValues[shortcode].value);
    promoCodeDetails.code = welcomePromocodeValues[shortcode].code;
  }
  return promoCodeDetails;
};

export { welcomePromocodeValues, getWelcomePromo };
