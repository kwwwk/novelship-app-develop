import { HomeTopTabRoutes } from 'types/navigation';
import { ProductType } from 'types/resources/product';

import React, { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useQuery } from 'react-query';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { ScrollContainer } from 'app/components/layout';
import { CACHE_TIME } from 'common/constants';
import { Box } from 'app/components/base';
import useUserViewedProducts from 'app/services/userViewedProduct/useUserViewedProducts';
import Analytics from 'app/services/analytics';
import { useStoreState } from 'app/store';
import AlgoliaClient from 'app/services/algolia';
import { buildAlgoliaFilterString } from 'app/screens/browse/utils';

import HomeSection, { HomeSectionProps } from './HomeSection';
import HomeBanner from './HomeBanner';

const HomeTab = ({ route }: StackScreenProps<HomeTopTabRoutes, ProductType['class']>) => {
  const currentCountryCode = useStoreState((s) => s.country.current.shortcode);

  const mostPopularIndex = Object.keys(AlgoliaClient).includes(`mostPopular${currentCountryCode}`)
    ? `mostPopular${currentCountryCode}`
    : 'mostPopular';

  const { data: mostPopular = [] } = useQuery(
    `most-popular/${route.name}`,
    () =>
      AlgoliaClient[mostPopularIndex as 'mostPopular']<ProductType>('', {
        // @ts-ignore ignore
        filters: buildAlgoliaFilterString({ class: route.name }),
        facetingAfterDistinct: true,
        hitsPerPage: 10,
      }).then(({ hits }) => hits),
    {
      staleTime: CACHE_TIME.short,
    }
  );

  const {
    data: { latest, underRetail, newList } = {
      latest: [],
      underRetail: [],
      newList: [],
    },
  } = useQuery<{
    latest: ProductType[];
    underRetail: ProductType[];
    newList: ProductType[];
  }>(`views/home/featured/${route.name}`, {
    staleTime: CACHE_TIME.short,
  });

  const { products: viewedProducts, exists: viewedProductsExist } = useUserViewedProducts(
    route.name
  );

  const { data: brandProducts = {} } = useQuery<Record<string, ProductType[]>>(
    `views/home/brands/${route.name}`,
    { staleTime: CACHE_TIME.short }
  );

  // move titles to backend as well once backend is able to translate them
  const data: HomeSectionProps[] = [
    {
      title: i18n._(t`Most Popular`),
      products: mostPopular,
      viewMoreParams: { sort: mostPopularIndex as 'mostPopular' },
    },

    route.name === 'Sneakers'
      ? {
          title: i18n._(t`Release Calendar`),
          products: latest,
          hintTitle: i18n._(t`RELEASE CALENDAR`),
          hintText: i18n._(
            t`Latest release sneakers sorted by release date. Local release date is based on your location.`
          ),
          viewMoreParams: { sort: `upcomingReleaseUS` },
        }
      : {
          title: i18n._(t`Latest Release`),
          products: latest,
          subTitle: i18n._(t`Up to 50% Off Seller Fee`),
          viewMoreParams: { sort: 'latestRelease' },
        },
    {
      title: i18n._(t`Under Retail`),
      products: underRetail,
    },
    { title: i18n._(t`New Lowest Listings`), products: newList },
    ...Object.keys(brandProducts).map((brand) => ({
      title: brand,
      products: brandProducts[brand],
    })),
  ];

  if (viewedProductsExist) {
    data.unshift({ title: i18n._(t`Recently Viewed`), products: viewedProducts });
  }

  useEffect(() => {
    Analytics.homepageProductCategory(route.name);
  }, [route.name]);

  return (
    <Box flex={1}>
      <ScrollContainer>
        <HomeBanner productCategory={route.name} />
        {data.map((d: HomeSectionProps) => (
          <HomeSection key={`${route.name}:${d.title}`} productCategory={route.name} {...d} />
        ))}
        <Box my={8} />
      </ScrollContainer>
    </Box>
  );
};

export default HomeTab;
