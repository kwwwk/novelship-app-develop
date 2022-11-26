import { isCurrentDateInRange } from 'common/utils/time';

const mapCityText: { [key: string]: string } = {
  tokyo: 'Tokyo',
  maldives: 'Maldives',
  bangkok: 'Bangkok',
  bali: 'Bali',
  sydney: 'Sydney',
  'new-york': 'New York',
  la: 'Los Angeles',
  berlin: 'Berlin',
};

export type CollectionCityType =
  | 'tokyo'
  | 'maldives'
  | 'bangkok'
  | 'bali'
  | 'sydney'
  | 'new-york'
  | 'la'
  | 'berlin';

export type EventConfigType = {
  start: string;
  end: string;
  banners: { [key: string]: string[] };
  eligibleCountry: string[];
};

const isCampaignTime = (start: string, end: string) =>
  !!(start && end && isCurrentDateInRange(start, end));

export { mapCityText, isCampaignTime };
