import React, { useState } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import theme from 'app/styles/theme';
import { WINDOW_WIDTH } from 'common/constants';
import { Box, ButtonBase, ImgixImage } from 'app/components/base';
import ProductImageZoomCarousel from './ProductImageZoomCarousel';

type CarouselImageProps = { item: string; index: number };

type ProductImageCarouselProps = {
  gallery: string[];
};

const ProductImageCarousel = ({ gallery }: ProductImageCarouselProps) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);

  const GalleryImage = ({ item, index }: CarouselImageProps) => (
    <ButtonBase onPress={() => setIsZoomModalVisible(true)} touchEffectDisabled>
      <Box center key={index} width={WINDOW_WIDTH} height={200} px={5}>
        <ImgixImage
          src={`${item}?fit=fill&bg=FFFFFF&trim=color`}
          height={200}
          width={WINDOW_WIDTH - 64}
        />
      </Box>
    </ButtonBase>
  );

  return (
    <>
      <Carousel
        data={gallery}
        renderItem={GalleryImage}
        sliderWidth={WINDOW_WIDTH}
        itemWidth={WINDOW_WIDTH}
        onSnapToItem={setCarouselIndex}
        useScrollView
        decelerationRate={200}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />
      <Pagination
        dotsLength={gallery.length}
        activeDotIndex={carouselIndex}
        inactiveDotOpacity={0.3}
        inactiveDotScale={0.5}
        containerStyle={{ paddingBottom: 0, paddingTop: 16 }}
        dotContainerStyle={{ marginHorizontal: 2 }}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          marginHorizontal: 0,
          backgroundColor: theme.colors.textBlack,
        }}
      />
      <ProductImageZoomCarousel
        modalVisible={isZoomModalVisible}
        onClose={() => setIsZoomModalVisible(false)}
        gallery={gallery}
        selectedImage={carouselIndex}
        imageHeight={280}
      />
    </>
  );
};

export default ProductImageCarousel;
