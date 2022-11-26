import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import API from 'common/api';
import envConstants from 'app/config';
import { Box, ButtonBase, ImgixImage } from 'app/components/base';
import { IS_OS_IOS } from 'common/constants';
import { sentryCapture } from 'app/services/sentry';
import { useStoreActions, useStoreState } from 'app/store';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import chooseImagesFromLibrary from 'app/services/image-picker';
import theme from 'app/styles/theme';

const selectionLimit = 1;

const Avatar = () => {
  const [loading, setLoading] = useState(false);
  const avatar = useStoreState((s) => s.user.user.avatar);
  const updateUser = useStoreActions((s) => s.user.update);

  const handleSubmit = () => {
    chooseImagesFromLibrary(selectionLimit).then((assets) => {
      if (!assets) return;

      const { type, uri = '', fileName } = assets[0];
      setLoading(true);
      API.post<{ url: string; fields: Record<string, string> }>('me/upload-avatar', {
        fileName,
      })
        .then((res) => {
          const formData = new FormData();
          Object.keys(res.fields).forEach((key) => formData.append(key, res.fields[key]));
          formData.append('Content-Type', type || '');
          formData.append('file', {
            // @ts-ignore ignore
            name: fileName || '',
            type: type || '',
            uri: IS_OS_IOS ? uri.replace('file://', '') : uri,
          });

          // axios doesn't work properly with multipart/form-data in RN. issue: https://github.com/axios/axios/issues/318#issuecomment-590221180
          return fetch(res.url, { method: 'POST', body: formData }).then((uploadedImg) => {
            if (uploadedImg.ok) {
              const imageSlug = decodeURIComponent(
                // @ts-ignore ignore
                uploadedImg.headers?.map?.location?.replace(uploadedImg.url, '')
              );
              return updateUser({
                avatar:
                  envConstants.IMGIX_URL +
                  (imageSlug.startsWith('/') ? imageSlug.slice(1) : imageSlug),
              }).then(() => setLoading(false));
            }
            return undefined;
          });
        })
        .catch((e) => {
          sentryCapture(e);
          setLoading(false);
        });
    });
  };

  return (
    <ButtonBase onPress={handleSubmit}>
      <Box mb={4} position="relative">
        {avatar ? (
          <ImgixImage
            width={60}
            height={60}
            src={avatar}
            resizeMode="cover"
            style={styles.circle}
          />
        ) : (
          <Box width={65} height={60} center>
            <Ionicons name="ios-person-circle-sharp" color={theme.colors.gray4} size={65} />
          </Box>
        )}
        <Box
          center
          position="absolute"
          width={22}
          height={22}
          borderRadius={22 / 2}
          bottom={2}
          backgroundColor="white"
          left={42}
          borderWidth={1}
          borderColor="black2"
        >
          {loading ? (
            <LoadingIndicator />
          ) : (
            <MaterialCommunityIcons name="pencil-outline" size={13} />
          )}
        </Box>
      </Box>
    </ButtonBase>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
});

export default Avatar;
