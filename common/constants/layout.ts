import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import theme from 'app/styles/theme';

const TAB_BAR_SCREEN_OPTIONS: MaterialTopTabNavigationOptions = {
  lazy: true,
  swipeEnabled: false,
  tabBarAllowFontScaling: false,
  tabBarActiveTintColor: theme.colors.textBlack,
  tabBarInactiveTintColor: theme.colors.gray3,
  tabBarIndicatorStyle: { backgroundColor: theme.colors.bgBlack },
  tabBarContentContainerStyle: {
    height: theme.constants.LAYOUT_BAR_ELEMENT_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    letterSpacing: theme.constants.LETTER_SPACINGS_TEXT_BASE,
  },
};

export { TAB_BAR_SCREEN_OPTIONS };
