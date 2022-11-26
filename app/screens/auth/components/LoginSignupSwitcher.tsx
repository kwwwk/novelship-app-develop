import React from 'react';
import { Box, Button } from 'app/components/base';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthRoutes } from 'types/navigation';
import { useNavigation } from '@react-navigation/native';
import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';

const LoginSignUpSwitcher = ({ screen, ...props }: { screen: 'login' | 'signup' }) => {
  const navigation = useNavigation<StackNavigationProp<AuthRoutes, 'LogIn'>>();

  return (
    <Box center flexDirection="row" {...props}>
      <Button
        text={i18n._(t`LOG IN`)}
        variant={screen === 'login' ? 'black' : 'white'}
        size="lg"
        width="50%"
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        onPress={() => screen === 'login' || navigation.replace('LogIn')}
      />
      <Button
        text={i18n._(t`SIGN UP`)}
        variant={screen === 'signup' ? 'black' : 'white'}
        size="lg"
        width="50%"
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        onPress={() => screen === 'signup' || navigation.replace('SignUp')}
      />
    </Box>
  );
};

export default LoginSignUpSwitcher;
