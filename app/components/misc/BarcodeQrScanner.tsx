import { Modal } from 'react-native';
import { Trans } from '@lingui/macro';
import React, { useEffect } from 'react';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { check, request, PERMISSIONS } from 'react-native-permissions';

import { IS_OS_IOS, WINDOW_HEIGHT, WINDOW_WIDTH } from 'common/constants';
import theme from 'app/styles/theme';
import { ButtonBase, Text, Box } from '../base';

const SCANNER_HEIGHT = WINDOW_HEIGHT * (IS_OS_IOS ? 0.6 : 0.8);

const BarcodeQrScanner = ({
  isOpen,
  onClose = () => {},
  onRead = () => {},
}: {
  isOpen: boolean;
  onClose: () => void;
  onRead: (data: string) => void;
}) => {
  useEffect(() => {
    if (isOpen) {
      const permission = IS_OS_IOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
      check(permission).then((currentPermission) => {
        if (currentPermission === 'denied') {
          request(permission);
        }
      });
    }
  }, [isOpen]);

  return (
    <Modal animationType="fade" hardwareAccelerated visible={isOpen} onRequestClose={onClose}>
      <QRCodeScanner
        notAuthorizedView={
          <Box center height={SCANNER_HEIGHT}>
            <Text>
              <Trans>Camera permission required!</Trans>
            </Text>
          </Box>
        }
        cameraProps={{
          autoFocus: RNCamera.Constants.AutoFocus.on,
          flashMode: RNCamera.Constants.FlashMode.auto,
        }}
        containerStyle={{ height: WINDOW_HEIGHT, width: WINDOW_WIDTH }}
        cameraStyle={{ height: SCANNER_HEIGHT, width: WINDOW_WIDTH }}
        onRead={(e) => onRead(e.data)}
        topContent={
          <ButtonBase onPress={onClose} style={{ alignSelf: 'flex-end', marginRight: 12 }}>
            <Ionicon
              name="ios-close"
              size={theme.constants.HEADER_ICON_SIZE * 1.6}
              color={theme.colors.gray1}
              style={{ padding: 6 }}
            />
          </ButtonBase>
        }
      />
    </Modal>
  );
};

export default BarcodeQrScanner;
