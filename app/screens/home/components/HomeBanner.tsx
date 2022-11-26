import { ProductType } from 'types/resources/product';
import { BannerType } from 'types/resources/banner';
import { RootRoutes } from 'types/navigation';

import React from 'react';
import { useLinkTo, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from 'react-query';

import { Box, ImgixImage, ButtonBase } from 'app/components/base';
import { WINDOW_WIDTH, CACHE_TIME } from 'common/constants';
import { buildQueryString } from 'common/utils';
import { ScrollContainer } from 'app/components/layout';
import { externalRoutes } from 'common/constants/url';
import { useStoreState } from 'app/store';
import theme from 'app/styles/theme';
import Analytics from 'app/services/analytics';

const BANNER_ASPECT_RATIO = Math.round((1204 / 650) * 1000) / 1000;
const BANNER_WIDTH = WINDOW_WIDTH * 0.82;
const BANNER_HEIGHT = BANNER_WIDTH / BANNER_ASPECT_RATIO;

const HomeBanner = ({ productCategory }: { productCategory: ProductType['class'] }) => {
  const linkTo = useLinkTo();
  const navigation = useNavigation<StackNavigationProp<RootRoutes, 'BottomNavStack'>>();
  const currentCountryShortCode = useStoreState((s) => s.country.current.shortcode);
  const currentLanguage = useStoreState((s) => s.language.current);

  const filters = {
    country: currentCountryShortCode,
    language: currentLanguage,
    device: 'app',
  };
  const bannerApiUrl = `banners/home?${buildQueryString(filters)}`;
  const { data: slides = [] } = useQuery<BannerType[]>(bannerApiUrl, {
    staleTime: CACHE_TIME.short,
  });

  const activeBanners = slides.filter(
    (s) => s.main_category === 'all' || s.main_category === productCategory.toLowerCase()
  );

  const openBannerUrl = (to: string) => {
    if (to) {
      const isHttp = to.startsWith('http');
      if (isHttp || externalRoutes.includes(to)) {
        return navigation.navigate('NotFoundScreen', { uri: to });
      }
      return linkTo(to.startsWith('/') ? to : `/${to}`);
    }
  };

  return (
    <Box my={5}>
      <ScrollContainer horizontal>
        {activeBanners.length ? (
          activeBanners.map((banner, i) => {
            const { title, id, main_category, url, image, device } = banner;
            const slide = { title, id, main_category, url, image, device };
            return (
              <ButtonBase
                onPress={() => {
                  openBannerUrl(banner.url);
                  Analytics.click('Home > Banner', {
                    ...slide,
                    index: i + 1,
                  });
                }}
                key={banner.id}
              >
                <Box
                  center
                  height={BANNER_HEIGHT}
                  width={BANNER_WIDTH}
                  ml={5}
                  mr={activeBanners.length - 1 === i ? 5 : 1}
                >
                  <ImgixImage
                    src={banner.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: theme.colors.gray7,
                    }}
                    resizeMode="cover"
                  />
                </Box>
              </ButtonBase>
            );
          })
        ) : (
          <Box height={BANNER_HEIGHT} />
        )}
      </ScrollContainer>
    </Box>
  );
};

export default HomeBanner;
