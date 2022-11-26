import envConstants from 'app/config';
import API from 'common/api';
import { cacheGet, cacheSet } from './asyncStorage';

export type LocationType = {
  success: boolean;
  country_code: string;
};

const getLocation = (): Promise<LocationType | undefined> =>
  cacheGet<LocationType>('detected_location').then((cachedLocation) => {
    if (cachedLocation) return cachedLocation;

    return API.fetch<LocationType>(
      `https://api.ipstack.com/check?access_key=${envConstants.IPSTACK_ACCESS_KEY}`
    )
      .then((location: LocationType) => cacheSet('detected_location', location))
      .catch(() => undefined);
  });

export default getLocation;
