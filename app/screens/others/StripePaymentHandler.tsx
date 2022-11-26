import * as React from 'react';
import { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useStripe } from '@stripe/stripe-react-native';

import { RootRoutes } from 'types/navigation';
import envConstants from 'app/config';
import LoadingScreen from 'app/components/misc/LoadingScreen';

const StripePaymentHandler = ({
  navigation,
  route,
}: StackScreenProps<RootRoutes, 'StripePaymentHandler'>) => {
  const { handleURLCallback } = useStripe();

  useEffect(() => {
    const url = `${envConstants.APP_URL_SCHEME}://${route.path}`;
    console.log('StripePaymentHandler', url);
    handleURLCallback(url).then(() => navigation.goBack());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingScreen />;
};

export default StripePaymentHandler;
