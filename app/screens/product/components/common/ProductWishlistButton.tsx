import React, { useContext, useState } from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';

import theme from 'app/styles/theme';
import { useStoreState } from 'app/store';
import { ButtonBase, Box } from 'app/components/base';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { ProductRoutes, RootRoutes } from 'types/navigation';
import ProductCheckoutContext from '../../context';

type ProductNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'Product'>,
  StackNavigationProp<RootRoutes, 'AuthStack'>
>;

const ProductWishlistButton = ({
  mode,
  size = 'OS',
}: {
  mode: 'header' | 'sizes';
  size?: string;
}) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const userId = useStoreState((s) => s.user.user.id);
  const navigation = useNavigation<ProductNavigationProp>();

  const {
    product,
    wishListedSizes,
    wishlistProductSize,
    size: { getDisplaySize },
  } = useContext(ProductCheckoutContext);

  const buttonAction = () => {
    if (mode === 'header') {
      if (product.is_one_size) {
        if (!userId) {
          return navigation.navigate('AuthStack', { screen: 'SignUp' });
        }
        setIsFetching(true);
        return wishlistProductSize({ size: 'OS', local_size: 'OS' }).finally(() =>
          setIsFetching(false)
        );
      }
      return navigation.navigate('SizesWishlist');
    }

    if (!userId) {
      navigation.navigate('AuthStack', { screen: 'SignUp' });
    } else {
      setIsFetching(true);
      wishlistProductSize({
        size,
        local_size: getDisplaySize(size).collatedTranslatedSize,
      }).finally(() => setIsFetching(false));
    }
  };

  const isHeader = mode === 'header';
  const isItemWishListed = isHeader ? !!wishListedSizes.length : wishListedSizes.includes(size);

  return (
    <Box center width={theme.constants.HEADER_ICON_SIZE} height={theme.constants.HEADER_ICON_SIZE}>
      {isFetching ? (
        <LoadingIndicator color={isHeader ? theme.colors.white : theme.colors.textBlack} />
      ) : (
        <ButtonBase
          onPress={() => buttonAction()}
          android_ripple={{
            color: isHeader ? theme.colors.white : theme.colors.rippleGray,
            borderless: true,
          }}
        >
          <MaterialCommunityIcon
            name={isItemWishListed ? 'heart' : 'heart-outline'}
            size={theme.constants.HEADER_ICON_SIZE}
            color={
              isItemWishListed
                ? theme.colors.red
                : isHeader
                ? theme.colors.white
                : theme.colors.textBlack
            }
          />
        </ButtonBase>
      )}
    </Box>
  );
};

export default ProductWishlistButton;
