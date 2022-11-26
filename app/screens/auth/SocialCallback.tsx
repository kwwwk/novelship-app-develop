import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthRoutes } from 'types/navigation';
import { useStoreActions } from 'app/store';
import { getUserSignupAndLoginMethodName } from 'common/utils/user';
import Analytics from 'app/services/analytics';
import { sentryCapture } from 'app/services/sentry';
import LoadingScreen from 'app/components/misc/LoadingScreen';

const SocialCallback = ({ route, navigation }: StackScreenProps<AuthRoutes, 'SocialCallback'>) => {
  const { authorize } = useStoreActions((a) => a.user);
  const openReferralInputDialog = useStoreActions((a) => a.referralInputDialog.openDialog);
  const { token, signup } = route.params || {};

  React.useEffect(() => {
    try {
      if (token) {
        authorize(token).then((user) => {
          if (signup) {
            Analytics.signup('Complete', user, getUserSignupAndLoginMethodName(user));
            setTimeout(openReferralInputDialog, 1000);
          } else {
            Analytics.login(user, getUserSignupAndLoginMethodName(user));
          }
        });
      } else {
        navigation.navigate('LogIn');
      }
    } catch (e) {
      sentryCapture(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingScreen />;
};

export default SocialCallback;
