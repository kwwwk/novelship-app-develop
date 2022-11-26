import { Alert, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';
import { IS_RELEASE_PRODUCTION } from 'common/constants';
import { sentryCapture } from 'app/services/sentry';

let isUpdatedChecked = false;

const appStoreUpdateCheck = () => {
  if (!IS_RELEASE_PRODUCTION || isUpdatedChecked) return;
  isUpdatedChecked = true;

  VersionCheck.needUpdate()
    .then((res) => {
      if (res && res.isNeeded) {
        Alert.alert(
          'App Update Available',
          'A new app update is available. Please update to get the latest features and best experience.',
          [
            { text: 'Dismiss', style: 'cancel' },
            { text: 'Update', onPress: () => Linking.openURL(res.storeUrl) },
          ],
          { cancelable: true }
        );
      }
    })
    .catch((error) => sentryCapture(error));
};

export default appStoreUpdateCheck;
