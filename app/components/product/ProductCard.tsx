import { RootRoutes, ProductRoutes } from 'types/navigation';
import { ProductType } from 'types/resources/product';

import React from 'react';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Box, ButtonBase, ImgixImage, Text } from 'app/components/base';
import { AlgoliaIndices } from 'app/services/algolia';
import { useStoreState } from 'app/store';
import { BoxProps } from 'app/components/base/Box';
import { toDate } from 'common/utils/time';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import AlgoliaInsights from 'app/services/algolia-insights';

import Analytics from 'app/services/analytics/index';
import InstantAvailableIndicator from './InstantAvailableIndicator';

const productCardStyleProps = {
  home: {
    width: 148,
    px: 3,
    py: 3,
    borderRadius: 4,
    imageHeight: 84,
    fontSize: 13,
  },
  search: {
    width: '100%',
    px: 5,
    py: 4,
    imageHeight: 100,
    fontSize: 14,
  },
} as Record<'home' | 'search', BoxProps & { imageHeight: number; fontSize: number }>;

const ProductCard = ({
  product,
  styleName,
  section,
  index,
  sort,
  ...props
}: {
  product: ProductType;
  styleName: keyof typeof productCardStyleProps;
  section?: string;
  index?: number;
  sort?: keyof typeof AlgoliaIndices;
} & BoxProps) => {
  type ProductNavigationProp = CompositeNavigationProp<
    StackNavigationProp<ProductRoutes, 'Product'>,
    StackNavigationProp<RootRoutes, 'ProductStack'>
  >;

  const navigation = useNavigation<ProductNavigationProp>();
  const currentCountryShortCode = useStoreState((s) => s.country.current.shortcode);
  const { $toList } = useCurrencyUtils();

  const { imageHeight, fontSize, ...styles } = productCardStyleProps[styleName];
  const isBrowse = section === 'Browse';
  const showReleaseDate = sort?.includes('Release');
  const localReleaseDate =
    product.drop_dates_local?.[currentCountryShortCode] ||
    // @ts-ignore ignore
    (product[`drop_date_timestamp_${currentCountryShortCode}`] &&
      // @ts-ignore ignore
      product[`drop_date_timestamp_${currentCountryShortCode}`] * 1000);

  const onProductCardPress = () => {
    if (section) {
      Analytics.productCardClick(product, section);
    }
    if (product.queryID && index !== undefined && sort) {
      AlgoliaInsights.productClicked({
        position: index,
        sort,
        ...product,
      });
    }
    navigation.push('ProductStack', { screen: 'Product', slug: product.name_slug });
  };

  return (
    <ButtonBase onPress={onProductCardPress}>
      <Box borderWidth={1} borderColor="gray7" {...styles} {...props}>
        <Box center width="100%" mt={3}>
          <Box
            height={showReleaseDate ? 35 : 16}
            width="100%"
            flexDirection="row"
            justifyContent={showReleaseDate ? 'space-between' : 'flex-end'}
            alignItems="flex-start"
          >
            {showReleaseDate && (
              <Box style={{ marginTop: -10 }}>
                {[
                  { date: product.drop_date, country: 'US' },
                  { date: localReleaseDate, country: currentCountryShortCode },
                ].map(({ date, country }) =>
                  date && toDate(date, 'product') ? (
                    <Text
                      key={country}
                      textTransform="uppercase"
                      fontFamily="bold"
                      color="gray3"
                      fontSize={1}
                    >
                      {toDate(date, 'product')} ({country})
                    </Text>
                  ) : null
                )}
              </Box>
            )}
            <InstantAvailableIndicator
              view={isBrowse ? 'half' : 'icon'}
              style={{ top: -10, right: -6, zIndex: 1 }}
              isInstantAvailable={product.is_instant_available}
            />
          </Box>
          <ImgixImage src={product.image} height={imageHeight} width={imageHeight * 1.45} />
        </Box>

        <Box mt={4} ml={1} minHeight={38}>
          <Text style={{ fontSize }} fontFamily="medium" numberOfLines={2} lineHeight={16}>
            {product.short_name || product.name}
          </Text>
        </Box>

        <Box flexDirection="row" justifyContent="space-between">
          <Text my={2} fontFamily="bold">
            {$toList(product.lowest_listing_price) || '--'}
          </Text>
          {/* {showReleaseDate && (
            <ButtonBase
              onPress={() =>
                navigation.navigate('ProductStack', {
                  screen: 'SizesWishlist',
                  slug: product.name_slug,
                })
              }
            >
              <MaterialCommunityIcon
                name="heart-outline"
                size={theme.constants.HEADER_ICON_SIZE}
                color={theme.colors.textBlack}
              />
            </ButtonBase>
          )} */}
        </Box>
      </Box>
    </ButtonBase>
  );
};

export default ProductCard;
