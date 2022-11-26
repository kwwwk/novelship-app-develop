import { createTheme } from '@shopify/restyle';

// https://coolors.co/0a0a0a-131315-1f1f21-48484c-68686e-8f8f96-a7a7ac-cfcfd4-e5e5e9-f6f5f8
const palette = {
  white: '#FFFFFF',

  gray1: '#48484c',
  gray2: '#69697c',
  gray3: '#8f8f96',
  gray4: '#a7a7ad',
  gray5: '#cfcfd4',
  gray6: '#e5e5e9',
  gray7: '#f6f5f8',
  gray8: '#fafafc',
  gray9: '#fcfcfd',
  divider: '#f2f2fc',

  // black1: '#0A0A0A',
  black2: '#131315',
  black3: '#1F1F21',

  yellow: '#F4C93E',
  blue: '#2366FF',
  red: '#E71524',
  orange: '#F56A19',
  orange2: '#eba900',
  green: '#009D78',
  alert: '#EE9748',
  goldenrod: '#EBA900',
  facebook: '#3B5998',
  bitcoin: '#F7931A',
  transparent: 'transparent',
};

const colors = {
  ...palette,
  textBlack: palette.black3,
  textError: palette.red,
  textSecondary: palette.gray2,

  bgBlack: palette.black2,

  buttonTextBlack: palette.black3,
  buttonBgBlack: palette.black2,

  dividerGray: palette.divider,
  borderLightGray: palette.gray6,

  rippleGray: palette.gray6,
};

const FONTS = {
  regular: 'IBMPlexSans',
  medium: 'IBMPlexSans-Medium',
  bold: 'IBMPlexSans-SemiBold',
  bolder: 'IBMPlexSans-Bold',
};

// Having these constants here will help us change them easily and also make them dynamic with
// screen resolution or dpis. We would be able to have our responsive style logics within one global space
const BUTTON_HEIGHT = 40;
const BUTTON_LARGE_HEIGHT = 46;

const LAYOUT_BAR_ELEMENT_LARGE_HEIGHT = 46;
const LAYOUT_BAR_ELEMENT_HEIGHT = 38;

const HEADER_ICON_SIZE = 26;

const LETTER_SPACINGS_TEXT_BASE = 0.1;
const LETTER_SPACINGS_TEXT_TITLE = 0.4;
const LETTER_SPACINGS_BUTTON_TEXT = 0.4;

const BUTTON_SIZES_COMMON = {
  // values for [xs, sm, md, lg] sizes
  fontSizes: [12, 13, 14, 15],
  heights: [24, 30, BUTTON_HEIGHT, BUTTON_LARGE_HEIGHT],
};

const theme = createTheme({
  colors,
  fonts: FONTS,
  // - - - - [  0,    1,    2,    3,    4,     5,     6,     7,     8,     9,      10],
  spacing: { 0: 0, 1: 2, 2: 4, 3: 8, 4: 12, 5: 16, 6: 20, 7: 24, 8: 30, 9: 36, 10: 48 },
  // - - - - [0,  1,  2,  3,  4,  5,  6,  7,  8,   9],
  fontSizes: [10, 12, 14, 16, 18, 20, 24, 28, 34, 40],
  breakpoints: {
    phone: 0,
    longPhone: {
      width: 0,
      height: 812,
    },
    tablet: 768,
    largeTablet: 1024,
  },
  textVariants: {
    defaults: {
      fontSize: 16,
      fontFamily: FONTS.regular,
      color: 'textBlack',
      letterSpacing: LETTER_SPACINGS_TEXT_BASE,
    },
    title: {
      fontSize: 18,
      fontFamily: FONTS.bold,
      letterSpacing: LETTER_SPACINGS_TEXT_BASE,
    },
  },
  buttonVariants: {
    black: {
      ...BUTTON_SIZES_COMMON,
      letterSpacing: LETTER_SPACINGS_BUTTON_TEXT,
      color: colors.buttonBgBlack,
      textColor: colors.white,
      borderWidth: undefined,
      fontFamily: FONTS.bold,
      disabled: {
        color: colors.gray3,
        textColor: colors.gray8,
      },
      props: {
        activeOpacity: 0.8,
      },
    },
    white: {
      ...BUTTON_SIZES_COMMON,
      letterSpacing: LETTER_SPACINGS_BUTTON_TEXT,
      color: colors.white,
      textColor: colors.buttonTextBlack,
      borderWidth: 1,
      fontFamily: FONTS.bold,
      disabled: {
        color: colors.white,
        textColor: colors.gray3,
        borderColor: colors.gray3,
      },
      props: {
        activeOpacity: 0.5,
        android_ripple: { color: colors.gray6 },
      },
    },
    lightGray: {
      ...BUTTON_SIZES_COMMON,
      letterSpacing: LETTER_SPACINGS_BUTTON_TEXT,
      color: colors.gray7,
      textColor: colors.buttonTextBlack,
      borderWidth: 0,
      fontFamily: FONTS.bold,
      disabled: {
        color: colors.gray7,
        textColor: colors.gray4,
      },
      props: {
        activeOpacity: 0.5,
        android_ripple: { color: colors.gray6 },
      },
    },
    'red-inverted': {
      ...BUTTON_SIZES_COMMON,
      letterSpacing: LETTER_SPACINGS_BUTTON_TEXT,
      color: colors.white,
      textColor: colors.red,
      borderColor: colors.red,
      borderWidth: 1,
      fontFamily: FONTS.bold,
      disabled: {
        color: colors.red,
        textColor: colors.gray3,
        borderColor: colors.gray3,
      },
      props: {
        activeOpacity: 0.5,
        android_ripple: { color: colors.gray6 },
      },
    },
  },
  constants: {
    BUTTON_HEIGHT,
    BUTTON_LARGE_HEIGHT,
    HEADER_ICON_SIZE,
    LAYOUT_BAR_ELEMENT_HEIGHT,
    LAYOUT_BAR_ELEMENT_LARGE_HEIGHT,
    LETTER_SPACINGS_BUTTON_TEXT,
    LETTER_SPACINGS_TEXT_BASE,
    LETTER_SPACINGS_TEXT_TITLE,
  },
});

export type Theme = typeof theme;
export default theme;
