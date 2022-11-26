import * as React from 'react';
import { useEffect } from 'react';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { StackScreenProps } from '@react-navigation/stack';
import { ImageBackground } from 'react-native';

import { Box, Text, Button, ButtonBase } from 'app/components/base';
import { RootRoutes } from 'types/navigation';
import { useStoreState } from 'app/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LanguageSelector from 'app/components/widgets/LanguageSelector';

const LogoText = () => (
  <>
    {'NOVELSHIP'.split('').map((c) => (
      <Box key={c} center px={2} mx={1}>
        <Text fontFamily="bold" fontSize={36} color="white" textAlign="center">
          {c}
        </Text>
      </Box>
    ))}
  </>
);

const StartScreen = ({ navigation }: StackScreenProps<RootRoutes, 'StartScreen'>) => {
  const userId = useStoreState((s) => s.user.user.id);
  const insets = useSafeAreaInsets();

  const goToHomeScreen = () =>
    navigation.replace('BottomNavStack', {
      screen: 'HomeStack',
      params: { screen: 'Sneakers' },
    });

  useEffect(() => {
    if (userId) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        goToHomeScreen();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <Box flex={1} style={{ backgroundColor: '#1c1c20' }}>
      <ImageBackground
        source={require('assets/images/graphics/start-background.png')}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          flex={1}
          alignItems="center"
          justifyContent="flex-end"
          width="80%"
          maxWidth={300}
          style={{ paddingBottom: '20%', marginBottom: insets.bottom }}
        >
          <Box center marginBottom={3} flexDirection="row" width="100%">
            <LogoText />
          </Box>
          <Box my={2} width="100%">
            <Button
              text={i18n._(t`SIGN UP`)}
              variant="white"
              style={{ borderColor: 'white' }}
              onPress={() => navigation.navigate('AuthStack', { screen: 'SignUp' })}
            />
          </Box>
          <Box my={2} width="100%">
            <Button
              text={i18n._(t`START BROWSING`)}
              variant="white"
              style={{ borderColor: 'white' }}
              onPress={goToHomeScreen}
            />
          </Box>
          <Text mt={3} fontSize={3} color="white">
            <Trans>Have an account?</Trans>
          </Text>
          <ButtonBase onPress={() => navigation.navigate('AuthStack', { screen: 'LogIn' })}>
            <Text fontSize={3} color="white" fontFamily="bold" textDecorationLine="underline">
              <Trans>LOG IN</Trans>
            </Text>
          </ButtonBase>
          <LanguageSelector variant="white" mt={2} />
        </Box>
      </ImageBackground>
    </Box>
  );
};

export default StartScreen;
