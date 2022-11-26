import React from 'react';

import { Box, ImgixImage } from 'app/components/base';
import { WINDOW_WIDTH } from 'common/constants';
import { ScrollContainer } from 'app/components/layout';
import { useStoreState } from 'app/store';
import { EventConfigType } from '../utils';

const BANNER_WIDTH = WINDOW_WIDTH;
const BANNER_HEIGHT = 120;

const TravelWithNSBanner = ({ eventConfig }: { eventConfig: EventConfigType }) => {
  const currentCountryShortCode = useStoreState((s) => s.country.current.shortcode);
  const isCampaignEligibleCountry = eventConfig.eligibleCountry.includes(currentCountryShortCode);
  const country = isCampaignEligibleCountry ? currentCountryShortCode : 'SG';

  const activeBanners = eventConfig.banners[country] || [];

  return (
    <ScrollContainer horizontal>
      {activeBanners.length ? (
        activeBanners.map((banner, i) => (
          <Box center height={BANNER_HEIGHT} width={BANNER_WIDTH} key={i}>
            <ImgixImage
              src={`events/2022/travelWithNS/banners/${banner}`}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </Box>
        ))
      ) : (
        <Box height={BANNER_HEIGHT} />
      )}
    </ScrollContainer>
  );
};

export default TravelWithNSBanner;
