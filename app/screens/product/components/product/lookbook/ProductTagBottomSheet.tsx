import { Trans } from '@lingui/macro';
import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { StackNavigationProp } from '@react-navigation/stack';

import theme from 'app/styles/theme';
import { RootRoutes } from 'types/navigation';
import AlgoliaClient from 'app/services/algolia';
import { ProductType } from 'types/resources/product';
import { buildAlgoliaFilterString } from 'app/screens/browse/utils';
import { Box, ButtonBase, Text, ImgixImage } from 'app/components/base';

const ProductTagBottomSheet = ({
  handleDismissModalPress,
  productTag,
}: {
  handleDismissModalPress: () => void;
  productTag: number[];
}) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes, 'ProductStack'>>();
  const [tagProducts, setTagProducts] = useState<ProductType[]>([]);

  const fetchTagProducts = () =>
    AlgoliaClient.mostPopular<ProductType>('', {
      // @ts-ignore not a global filter
      filters: buildAlgoliaFilterString({ product_id: productTag }),
    })
      .then(({ hits }) => setTagProducts(hits))
      .catch(() => setTagProducts([]));

  useEffect(() => {
    if (productTag) {
      fetchTagProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTag]);

  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      <Box
        flexDirection="row"
        width="100%"
        justifyContent="space-between"
        style={styles.sectionHeaderContainer}
      >
        <Box width={theme.constants.HEADER_ICON_SIZE} />
        <Box center>
          <Text fontSize={3} fontFamily="bold">
            <Trans>TAGGED PRODUCTS</Trans>
          </Text>
        </Box>
        <Box alignItems="flex-end" width={theme.constants.HEADER_ICON_SIZE}>
          <ButtonBase
            onPress={handleDismissModalPress}
            android_ripple={{ color: theme.colors.white, borderless: true }}
          >
            <Ionicon
              name="ios-close"
              size={theme.constants.HEADER_ICON_SIZE}
              color={theme.colors.black2}
            />
          </ButtonBase>
        </Box>
      </Box>
      {tagProducts.map((product) => (
        <ButtonBase
          key={product.id}
          onPress={() => {
            navigation.push('ProductStack', {
              screen: 'Product',
              slug: product.name_slug,
            });
          }}
        >
          <Box
            flexDirection="row"
            justifyContent="space-between"
            borderBottomWidth={1}
            borderBottomColor="dividerGray"
            mx={5}
            py={2}
          >
            <Box mt={2}>
              <ImgixImage src={product.image} width={75} height={75} />
            </Box>
            <Box width="73%" mt={2} justifyContent="center">
              <Text
                textAlign="left"
                fontSize={2}
                lineHeight={16}
                fontFamily="medium"
                textTransform="uppercase"
              >
                {product.name}
              </Text>
            </Box>
          </Box>
        </ButtonBase>
      ))}
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#fff',
  },
  itemContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
    backgroundColor: '#fff',
  },
  sectionHeaderContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});

export default ProductTagBottomSheet;
