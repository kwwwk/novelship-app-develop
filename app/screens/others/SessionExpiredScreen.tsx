import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { RootRoutes } from 'types/navigation';
import { useEffect } from 'react';
import { useStoreActions } from 'app/store';
import LoadingScreen from 'app/components/misc/LoadingScreen';

const SessionExpiredScreen = ({
  navigation,
}: StackScreenProps<RootRoutes, 'SessionExpiredScreen'>) => {
  const logout = useStoreActions((a) => a.user.logout);

  useEffect(() => {
    logout();
    navigation.replace('AuthStack', {
      screen: 'LogIn',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingScreen />;
};

export default SessionExpiredScreen;
