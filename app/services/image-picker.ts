import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { Alert, Linking } from 'react-native';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';

import { IS_OS_IOS, LB } from 'common/constants';

const supportedImageFormats = ['image/jpg', 'image/jpeg', 'image/png'];
const options: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.2,
};

const chooseImages = (selectionLimit: number): Promise<Asset[] | null> =>
  new Promise((resolve) => {
    launchImageLibrary({ ...options, selectionLimit }, (data) => {
      if (data.didCancel) return resolve(null);
      if (data.assets && data.assets.length) {
        for (const image of data.assets) {
          const { fileSize, type, width, height, fileName, uri } = image;

          if (!uri || !fileName) {
            return resolve(null);
          }

          if (!supportedImageFormats.includes(String(type)))
            return Alert.alert(i18n._(t`This type of image is not supported`));
          if (Number(fileSize) >= 10485760)
            return Alert.alert(i18n._(t`Image size should be less than 10MB`));
          if (Number(fileSize) <= 10240)
            return Alert.alert(i18n._(t`Image size should be more than 10KB`));
          if (Number(height) < 750 || Number(width) < 750)
            return Alert.alert(i18n._(t`Minimum pixel size should be 750x750`));
        }

        return resolve(data.assets);
      }
      return resolve(null);
    });
  });

const chooseImagesFromLibrary = (selectionLimit = 1) => {
  const permission = IS_OS_IOS
    ? PERMISSIONS.IOS.PHOTO_LIBRARY
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

  return check(permission).then((currentPermission) => {
    if (currentPermission === 'denied' || currentPermission === 'blocked') {
      return request(permission).then((permissionStatus) => {
        if (permissionStatus === 'denied') return null;
        if (permissionStatus === 'blocked') {
          if (IS_OS_IOS) {
            Alert.alert(
              i18n._(t`Allow Access To Photos`),
              i18n._(t`1. Tap Settings${LB}2. Tap Photos${LB}3. Tap All Photos`),
              [
                { text: i18n._(t`Not Now`), style: 'default' },
                { text: i18n._(t`Settings`), onPress: () => Linking.openSettings() },
              ],
              { cancelable: true }
            );
            return null;
          }
          Alert.alert(
            i18n._(t`Allow Access To Photos`),
            i18n._(
              t`1. Tap Settings${LB}2. Tap Permissions${LB}3. Tap Files & Media${LB}4. Tap Allow access to media only`
            ),
            [
              { text: i18n._(t`Not Now`), style: 'default' },
              { text: i18n._(t`Settings`), onPress: () => Linking.openSettings() },
            ],
            { cancelable: true }
          );
          return null;
        }
        return chooseImages(selectionLimit);
      });
    }
    return chooseImages(selectionLimit);
  });
};

export default chooseImagesFromLibrary;
