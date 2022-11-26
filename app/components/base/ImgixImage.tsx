import React from 'react';
import { Image as RNImage, ImageProps } from 'react-native';

import { getImgixUrl } from 'common/constants';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type ImgixImageProps = PartialBy<ImageProps, 'source'>;

const ImgixImage = ({
  width,
  height,
  src,
  fullQuality = false,
  ...props
}: { src: string; fullQuality?: boolean } & ImgixImageProps) => {
  const imgSource = {
    uri: `${getImgixUrl(src, { fullQuality, width, height })}`,
    width,
    height,
  };

  return <RNImage source={imgSource} resizeMode="contain" {...props} />;
};

export default ImgixImage;
