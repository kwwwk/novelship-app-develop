import { i18n } from '@lingui/core';
import { IS_OS_IOS, IS_OS_ANDROID, LB } from 'common/constants';
import envConstants from 'app/config';
import OneSignal from 'react-native-onesignal';
import { UserType } from 'types/resources/user';
import { Alert, Linking } from 'react-native';
import { t } from '@lingui/macro';

class PushNotificationManager {
  constructor() {
    OneSignal.setAppId(envConstants.ONE_SIGNAL_APP_ID);
    if (__DEV__) {
      OneSignal.setLogLevel(6, 0);
      // Method for handling notifications received while app in foreground
      OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
        console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent);
        const notification = notificationReceivedEvent.getNotification();
        console.log('notification: ', notification);
        const data = notification.additionalData;
        console.log('additionalData: ', data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      });

      // Method for handling notifications opened
      OneSignal.setNotificationOpenedHandler((notification) => {
        console.log('OneSignal: notification opened:', notification);
      });
    }
  }

  identify = (user?: UserType) => {
    if (user?.ref) {
      OneSignal.setExternalUserId(user.ref, (results) => {
        console.log('setExternalUserId', results);
        // PushNotification.getStatus().then(console.log);
      });
      if (user.email) OneSignal.setEmail(user.email);
    } else {
      this.logout();
    }
  };

  logout = () => {
    OneSignal.removeExternalUserId((results) => {
      console.log('removeExternalUserId', results);
    });
  };

  prompt = () =>
    new Promise((res) =>
      OneSignal.promptForPushNotificationsWithUserResponse((isPermissionGranted) => {
        console.log({ isPermissionGranted });
        return res(isPermissionGranted);
      })
    );

  pushEnable = (pushEnable: boolean) => {
    if (!pushEnable) {
      // On Push disable, OneSignal stays subscribed, we disable preference within User preferences only
      // OneSignal.disablePush(true);
      return Promise.resolve(false);
    }

    if (IS_OS_ANDROID) {
      OneSignal.disablePush(false);
      return Promise.resolve(true);
    }

    if (IS_OS_IOS) {
      return this.prompt().then((isPermissionGranted) => {
        OneSignal.disablePush(false);
        if (!isPermissionGranted) {
          Alert.alert(
            i18n._(t`Allow Notifications`),
            i18n._(t`1. Tap Settings${LB}2. Tap Notifications${LB}3. Tap Allow Notifications`),
            [
              { text: i18n._(t`Not Now`), style: 'default' },
              { text: i18n._(t`Settings`), onPress: () => Linking.openSettings() },
            ],
            { cancelable: true }
          );
          return Promise.resolve(false);
        }
        return Promise.resolve(true);
      });
    }

    OneSignal.disablePush(false);
    return Promise.resolve(true);
  };

  isPushEnabled = () =>
    this.getStatus().then(
      (status) => !!(status?.hasNotificationPermission && status?.isSubscribed)
    );

  getStatus = OneSignal.getDeviceState;
}

const PushNotification = new PushNotificationManager();

export default PushNotification;
