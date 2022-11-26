import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { getExternalUrl } from 'app/services/url';
import { RootRoutes } from 'types/navigation';
import { WebScreen } from 'app/components/layout';

const NotFoundScreen = ({ route, navigation }: StackScreenProps<RootRoutes, 'NotFoundScreen'>) => {
  const path = route.path || route.params?.uri;

  const webPageURL = getExternalUrl(path);
  return <WebScreen navigation={navigation} source={{ uri: webPageURL }} />;
};

export default NotFoundScreen;
