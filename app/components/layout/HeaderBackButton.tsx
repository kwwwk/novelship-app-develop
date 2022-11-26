import React from 'react';
import { ButtonBase } from 'app/components/base';
import theme from 'app/styles/theme';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';
import { RootRoutes } from 'types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { navigateBackOrGoToHome } from 'app/services/navigation';

const HeaderBackButton: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();
  return (
    <ButtonBase
      onPress={() => {
        if (onGoBack) onGoBack();
        navigateBackOrGoToHome(navigation);
      }}
      android_ripple={{ color: theme.colors.white, borderless: true }}
    >
      <Ionicon
        name="ios-arrow-back"
        size={theme.constants.HEADER_ICON_SIZE}
        color={theme.colors.white}
      />
    </ButtonBase>
  );
};

export default HeaderBackButton;
