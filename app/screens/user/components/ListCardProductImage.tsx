import React from 'react';

import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ButtonBase, ImgixImage } from 'app/components/base';

import { RootRoutes } from 'types/navigation';
import { ProductType } from 'types/resources/product';

const ListCardProductImage = ({ product }: { product: ProductType }) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes, 'ProductStack'>>();

  return (
    <ButtonBase
      onPress={() =>
        navigation.navigate('ProductStack', {
          screen: 'Product',
          slug: product.name_slug,
        })
      }
      style={{
        minWidth: 60,
        minHeight: 56,
      }}
    >
      <ImgixImage src={product.image} height={48} width={60} />
    </ButtonBase>
  );
};

export default ListCardProductImage;
