import React, { useContext, useEffect, useRef } from 'react';
import { Trans } from '@lingui/macro';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { i18n } from '@lingui/core';

import { ScrollContainer, SafeAreaScreenContainer } from 'app/components/layout';
import { useStoreState, useStoreActions } from 'app/store';
import { ProductCollectionType } from 'types/resources/productCollection';
import { ProductType } from 'types/resources/product';
import { ProductRoutes, RootRoutes } from 'types/navigation';
import { Box, ButtonBase, Text } from 'app/components/base';
import InstantAvailableIndicator from 'app/components/product/InstantAvailableIndicator';
import ProductCardStacked from 'app/components/product/ProductCardStacked';
import Analytics from 'app/services/analytics';

import AnnouncementTicker from 'app/components/promotion/AnnouncementTicker';
import ProductSpecificationsList from './components/product/ProductSpecificationsList';
import ProductCheckoutContext from './context';
import ProductCollectionChip from './components/product/ProductCollectionChip';
import ProductSectionHeading from './components/product/ProductSectionHeading';
import ProductImageCarousel from './components/product/ProductImageCarousel';
import ProductDescription from './components/product/ProductDescription';
import ProductLastSale from './components/product/ProductLastSalePrice';
import ServiceBadges from './components/product/ServiceBadges';
import ProductCta from './components/product/ProductCta';
import SizeChart from './components/product/SizeChart';
import ProductWishListCard from './components/product/ProductWishlistCard';
import ProductLookbookSection from './components/product/ProductLookbookSection';
import ProductPromocodeList from './components/product/promotion/ProductPromocodeList';

type ProductNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'Product'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

const Product = ({ navigation }: { navigation: ProductNavigationProp }) => {
  const {
    product,
    productsRelated,
    isFetching,
    size: { map: sizeMap },
  } = useContext(ProductCheckoutContext);
  const userId = useStoreState((s) => s.user.user.id);
  const getCollectionBySlug = useStoreState((s) => s.base.getCollectionBySlug);
  const promptPushPermissionDialog = useStoreActions((a) => a.pushNotificationDialog.promptDialog);
  const viewProductTimer = useRef<NodeJS.Timer | null>(null);

  const collectionChips = product.collections
    .map((c) => getCollectionBySlug(c, product.class))
    .filter((c) => c.tag_color && c.tag_styling) as ProductCollectionType[];

  useEffect(() => {
    setTimeout(() => {
      promptPushPermissionDialog();
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    viewProductTimer.current = setTimeout(() => Analytics.productView(product), 2000);

    return () => {
      if (viewProductTimer.current) clearTimeout(viewProductTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const openLookbookPostCreate = () => {
    if (userId) {
      navigation.navigate('UserStack', {
        screen: 'PostEditStack',
        params: {
          screen: 'PostCreate',
          params: { product_id: product.id },
        },
      });
    } else {
      navigation.navigate('AuthStack', {
        screen: 'SignUp',
        redirectTo: `/dashboard/post/create/${product.id}`,
      });
    }
  };

  if (isFetching || !product.id) {
    return null;
  }

  return (
    <SafeAreaScreenContainer>
      <AnnouncementTicker />
      <ScrollContainer>
        <Box mt={5} mx={5}>
          <Text mb={3} variant="title" textTransform="uppercase">
            {product.name}
          </Text>
          {!!product.sku && (
            <Text fontSize={2} color="gray3" fontFamily="medium">
              <Trans>SKU:</Trans> {product.sku}
            </Text>
          )}
          <InstantAvailableIndicator
            justifyContent="flex-end"
            isInstantAvailable={product.is_instant_available}
          />
          <Box flexDirection="row" flexWrap="wrap" justifyContent="flex-end">
            {collectionChips.map((chip, x) => (
              <ProductCollectionChip
                tagColor={chip.tag_color}
                tagStyle={chip.tag_styling}
                key={x}
                ml={3}
                mt={1}
              >
                {i18n._(chip.name)}
              </ProductCollectionChip>
            ))}
          </Box>
        </Box>

        <Box mt={4}>
          <ProductImageCarousel gallery={product.gallery} />
        </Box>

        {!!product.last_sale_price && !product.is_buy_now_only && (
          <Box mt={5}>
            <ProductLastSale product={product} />
          </Box>
        )}
        {!!product.wishlist_active_count && (
          <Box mt={5}>
            <ProductWishListCard product={product} />
          </Box>
        )}

        {!!product.description && (
          <Box mt={7} mb={2} mx={5}>
            <Box
              px={6}
              pt={5}
              pb={6}
              borderRadius={6}
              borderColor="gray7"
              bg="gray9"
              borderWidth={1}
            >
              <ProductSectionHeading>
                <Trans>PRODUCT DETAILS</Trans>
              </ProductSectionHeading>
              <Box height={1} width="86%" alignSelf="center" bg="gray7" mt={3} />
              <ProductDescription description={product.description} />
            </Box>
          </Box>
        )}
        <Box my={7}>
          <ProductPromocodeList product={product} />
        </Box>
        <Box mx={5} my={4}>
          <ProductSectionHeading mb={3}>
            <Trans>SPECIFICATIONS</Trans>
          </ProductSectionHeading>
          <ProductSpecificationsList product={product} />
        </Box>

        <Box px={5} my={4}>
          <ProductSectionHeading mb={6}>
            <Trans>SERVICE GUARANTEE</Trans>
          </ProductSectionHeading>
          <ServiceBadges />
        </Box>

        {product.is_sneaker && Object.keys(sizeMap).length > 0 && (
          <Box mt={8}>
            <Box py={4} bg="black2">
              <ProductSectionHeading color="white" textTransform="uppercase">
                <Trans>{product.main_brand} SIZE CHART</Trans>
              </ProductSectionHeading>
            </Box>
            <SizeChart mode="product" />
          </Box>
        )}

        <Box mt={8}>
          <Box
            width="100%"
            alignItems="center"
            style={{ flexDirection: 'row' }}
            justifyContent="space-between"
            px={5}
            mb={4}
          >
            <Text textAlign="center" fontSize={3} fontFamily="bold">
              <Trans>LOOKBOOK</Trans>
            </Text>
            <ButtonBase onPress={openLookbookPostCreate}>
              <Box flexDirection="row">
                <Text textAlign="center" fontFamily="medium" fontSize={3}>
                  <Trans>SHARE</Trans>
                </Text>
                <Box style={{ paddingLeft: 2, marginTop: -1 }}>
                  <Ionicon name="add-outline" size={22} />
                </Box>
              </Box>
            </ButtonBase>
          </Box>
          <ProductLookbookSection openLookbookPostCreate={openLookbookPostCreate} />
        </Box>

        {!!productsRelated.length && (
          <>
            <ProductSectionHeading mt={10} mb={5} px={5}>
              <Trans>MORE LIKE THIS</Trans>
            </ProductSectionHeading>
            <Box flexDirection="row" flexWrap="wrap">
              {productsRelated.slice(0, 8).map((relatedProduct: ProductType, index: number) => (
                <ProductCardStacked key={index} product={relatedProduct} index={index} />
              ))}
            </Box>
          </>
        )}

        <Box my={8} />
      </ScrollContainer>
      <ProductCta />
    </SafeAreaScreenContainer>
  );
};

export default Product;
