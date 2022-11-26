import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Anchor, Box, Button, ButtonBase, ImgixImage, Text } from 'app/components/base';
import ProductCardStacked from 'app/components/product/ProductCardStacked';
import theme from 'app/styles/theme';
import { getImgixUrl } from 'common/constants';
import getFaqLink from 'common/constants/faq';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { RootRoutes } from 'types/navigation';
import { ProductType } from 'types/resources/product';
import { CollectionCityType, mapCityText } from '../utils';

const cities: CollectionCityType[] = [
  'tokyo',
  'maldives',
  'bangkok',
  'bali',
  'sydney',
  'new-york',
  'la',
  'berlin',
];
const getEventImg = (image: string) => getImgixUrl(`events/2022/travelWithNS/cities/${image}`);

const TravelWithNSCityCollection = () => {
  const [city, setCity] = useState<CollectionCityType>('tokyo');
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();

  const { data: { results: cityCollectionProducts } = { results: [] }, refetch } = useQuery<{
    results: ProductType[];
  }>(['products', { filter: { 'collections:include': `{${city}-edit}` } }], {
    initialData: { results: [] },
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <Box center mx={5} mt={6}>
      <Text fontFamily="bolder" fontSize={5} letterSpacing={1} lineHeight={44}>
        <Trans>CITY COLLECTION</Trans>
      </Text>
      <Box center width="100%" flexDirection="row" flexWrap="wrap" justifyContent="center">
        {cities.map((c: CollectionCityType, i: number) => (
          <Box key={i} center mt={5} width="25%">
            <ButtonBase onPress={() => setCity(c)}>
              <Box center>
                <ImgixImage
                  src={getEventImg(`${c}.png`)}
                  width={['maldives', 'sydney', 'la'].includes(c) ? 68 : 48}
                  height={46}
                  style={{ tintColor: c === city ? undefined : theme.colors.gray4 }}
                />
                <Text
                  pt={1}
                  mt={2}
                  style={{ color: c === city ? '#000' : '#90909C' }}
                  fontSize={1}
                  fontFamily="bold"
                  lineHeight={20}
                  textTransform="uppercase"
                >
                  {mapCityText[c]}
                </Text>
              </Box>
            </ButtonBase>
          </Box>
        ))}
      </Box>
      <Box flexDirection="row" flexWrap="wrap" my={5}>
        {cityCollectionProducts.slice(0, 8).map((relatedProduct: ProductType, index: number) => (
          <ProductCardStacked key={index} product={relatedProduct} index={index} />
        ))}
      </Box>

      <Button
        width="100%"
        variant="black"
        text={i18n._(t`VIEW MORE`)}
        onPress={() =>
          navigation.navigate('BottomNavStack', {
            screen: 'BrowseStack',
            params: {
              screen: 'BrowseRoot',
              params: { screen: 'All', params: { collection: `${city}-edit` } },
            },
          })
        }
      />

      <Anchor
        to={getFaqLink('travel_with_ns')}
        textDecorationLine="underline"
        textTransform="uppercase"
        lineHeight={20}
        fontSize={1}
        my={8}
      >
        <Trans>Terms & conditions</Trans>
      </Anchor>
    </Box>
  );
};

export default TravelWithNSCityCollection;
