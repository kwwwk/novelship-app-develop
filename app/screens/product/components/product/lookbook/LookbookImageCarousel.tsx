import React, { useState, createRef } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Ionicon from 'react-native-vector-icons/Ionicons';

import theme from 'app/styles/theme';
import { WINDOW_WIDTH } from 'common/constants';
import { Box, ButtonBase, ImgixImage } from 'app/components/base';
import { UserPostType } from 'types/resources/userPost';
import ProductImageZoomCarousel from '../ProductImageZoomCarousel';

type CarouselImageProps = { item: string; index: number };

type LookbookImageCarouselProps = {
  lookbookFeed: UserPostType;
  handlePresentModalPress: () => void;
  setProductTag: (p: number[]) => void;
};

const LookbookImageCarousel = ({
  lookbookFeed,
  handlePresentModalPress,
  setProductTag,
}: LookbookImageCarouselProps) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);
  const carouselRef: { current: any } = createRef();

  const { gallery, tags } = lookbookFeed;
  const hasProductTags = tags.length > 0;

  const LookBookImage = ({ item, index }: CarouselImageProps) => (
    <ButtonBase key={index} onPress={() => setIsZoomModalVisible(true)} touchEffectDisabled>
      <Box center width={WINDOW_WIDTH} height={WINDOW_WIDTH - 55}>
        <ImgixImage
          src={`${item}?fit=fill&bg=131315&trim=color`}
          width={WINDOW_WIDTH}
          height={WINDOW_WIDTH - 55}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
    </ButtonBase>
  );

  return (
    <Box center height={WINDOW_WIDTH - 20} pb={3}>
      <Carousel
        ref={carouselRef}
        data={gallery}
        renderItem={LookBookImage}
        sliderWidth={WINDOW_WIDTH}
        itemWidth={WINDOW_WIDTH}
        onSnapToItem={setCarouselIndex}
        style={{ height: WINDOW_WIDTH - 55 }}
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
        containerStyle={{ paddingBottom: 0, paddingTop: 12 }}
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
        imageHeight={600}
      />

      {hasProductTags && (
        <Box position="absolute" right={0} bottom={35} m={3} justifyContent="flex-end">
          <ButtonBase
            onPress={() => {
              handlePresentModalPress();
              setProductTag(tags);
            }}
          >
            <Box center width={35} height={35} bg="gray1" opacity={0.7} borderRadius={4}>
              <Ionicon name="pricetag-outline" color={theme.colors.white} size={22} />
            </Box>
          </ButtonBase>
        </Box>
      )}
    </Box>
  );
};

export default LookbookImageCarousel;
