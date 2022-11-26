import envConstants from 'app/config';
import { Dimensions, PixelRatio, Platform } from 'react-native';

// Use Imgix only for dynamic images from Database. Everything else will be part of the bundle, in `assets/`
const imgixUrl = envConstants.IMGIX_URL;
const getImgixUrl = (
  path: string,
  { fullQuality, width, height }: { fullQuality?: boolean; width?: number; height?: number } = {}
) => {
  const quality = fullQuality ? `q=100&auto=format` : `auto=format,compress`;
  const w = width ? PixelRatio.getPixelSizeForLayoutSize(width) : undefined;
  const h = height ? PixelRatio.getPixelSizeForLayoutSize(height) : undefined;

  return `${imgixUrl}${path.replace(imgixUrl, '')}${path.includes('?') ? '&' : '?'}${quality}${
    h ? `&h=${h}` : ''
  }${w ? `&w=${w}` : ''}`;
};

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const IS_OS_ANDROID = Platform.OS === 'android';
const IS_OS_IOS = Platform.OS === 'ios';

const IS_RELEASE_PRODUCTION = envConstants.RELEASE === 'production';

const MIL_SECS_IN_DAY = 24 * 60 * 60 * 1000;
const CACHE_TIME = {
  short: 0.5 * 60 * 1000,
  long: 15 * 60 * 1000,
};

// For Lingui.js #1132 #1100 https://github.com/lingui/js-lingui/issues/1132
const LB = '\n';

export {
  LB,
  MIL_SECS_IN_DAY,
  CACHE_TIME,
  getImgixUrl,
  IS_OS_ANDROID,
  IS_OS_IOS,
  IS_RELEASE_PRODUCTION,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
};
