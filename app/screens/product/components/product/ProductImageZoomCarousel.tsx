import React from 'react';
import { Modal, StatusBar } from 'react-native';
import theme from 'app/styles/theme';
import Carousel from 'react-native-snap-carousel';
import ImageZoom from 'react-native-image-pan-zoom';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'common/constants';
import { Box, ButtonBase, ImgixImage } from 'app/components/base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';

type ProductImageZoomCarouselProps = {
  modalVisible: boolean | false;
  selectedImage?: number | 0;
  onClose: () => void;
  gallery: string[];
  imageHeight: number;
};

type CarouselImageProps = { item: string; index: number };

const ProductImageZoomCarousel = ({
  modalVisible,
  selectedImage,
  gallery,
  onClose,
  imageHeight,
}: ProductImageZoomCarouselProps) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState<boolean>(true);
  const ProductImageZoom = ({ item, index }: CarouselImageProps) => (
    <Box key={index} center>
      <ImageZoom
        cropWidth={WINDOW_WIDTH}
        cropHeight={WINDOW_HEIGHT}
        imageWidth={WINDOW_WIDTH - 32}
        imageHeight={imageHeight}
      >
        <ImgixImage
          src={`${item}?fit=fill&bg=FFFFFF&trim=color`}
          style={{ height: imageHeight }}
          onLoad={() => setLoading(false)}
        />
        {loading && (
          <Box center position="absolute" width="100%" height="100%">
            <LoadingIndicator size="large" />
          </Box>
        )}
      </ImageZoom>
    </Box>
  );

  return (
    <Modal animationType="fade" hardwareAccelerated visible={modalVisible} onRequestClose={onClose}>
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
      <Carousel
        firstItem={selectedImage}
        data={gallery}
        renderItem={ProductImageZoom}
        sliderWidth={WINDOW_WIDTH}
        itemWidth={WINDOW_WIDTH}
        useScrollView
        decelerationRate={200}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />
      <ButtonBase
        onPress={onClose}
        style={{ position: 'absolute', right: 0, top: Math.max(insets.top - 8, 8) }}
      >
        <Ionicon
          name="ios-close"
          size={theme.constants.HEADER_ICON_SIZE * 1.6}
          color={theme.colors.gray1}
          style={{ padding: 6 }}
        />
      </ButtonBase>
    </Modal>
  );
};

export default ProductImageZoomCarousel;
