import { expireIn, getSGTTime, isCurrentDateInRange } from 'common/utils/time';
import { MIL_SECS_IN_DAY } from 'common/constants';
import { CurrencyType } from 'types/resources/currency';
import { $, getCurrentCurrency } from 'common/utils/currency';
import config from 'common/constants/environment';

// todo: fetch loyaltyPointsBonus from DB
const { start, end } = config.campaign;

const isCampaignTime = !!(start && end && isCurrentDateInRange(start, end));
const isLastDayOfCampaign =
  end && Math.ceil((Number(new Date(end)) - Number(getSGTTime())) / MIL_SECS_IN_DAY) === 1;

const checkAvailability = (discount: number | boolean) => !!discount;

const isSellingFeeDiscountAvailable = ({
  discount,
  type,
}: {
  discount: number;
  type: 'fixed' | 'fixed-reduction' | 'percentage';
}): boolean => (type === 'fixed' && discount >= 0) || discount > 0;

const isVoucherDiscountAvailable = ({
  shippingDiscount,
  sneakerDiscount,
  apparelDiscount,
  collectiblesDiscount,
}: {
  shippingDiscount: number;
  sneakerDiscount: number;
  apparelDiscount: number;
  collectiblesDiscount: number;
}) => ({
  Shipping: checkAvailability(shippingDiscount),
  Sneakers: checkAvailability(sneakerDiscount),
  Apparel: checkAvailability(apparelDiscount),
  Collectibles: checkAvailability(collectiblesDiscount),
});

const campaignTimeLeft = end ? expireIn(end, 'hour', true) : '';
const daySinceCampaignStarted = Math.floor(
  (Number(getSGTTime()) - Number(new Date(config.campaign.start || ''))) / MIL_SECS_IN_DAY
);

const campaignPromoValue = [30, 25, 90, 150, 30, 300000, 3000, 30];
const getCampaignPromoDiscount = (): string => {
  const currentCountry = getCurrentCurrency();
  const { id: currencyId = 2 }: CurrencyType = currentCountry;
  return $(campaignPromoValue[currencyId - 1], currentCountry);
};

export {
  isSellingFeeDiscountAvailable,
  isVoucherDiscountAvailable,
  getCampaignPromoDiscount,
  daySinceCampaignStarted,
  isLastDayOfCampaign,
  campaignTimeLeft,
  isCampaignTime,
};
