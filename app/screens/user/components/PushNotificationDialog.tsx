import React from 'react';
import { Box, Text, Button, ButtonBase } from 'app/components/base';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';

import { Image } from 'react-native';
import Dialog from 'app/components/dialog/Dialog';
import { useStoreActions, useStoreState } from 'app/store';
import PushNotification from 'app/services/pushNotification';

const notificationIcons = [
  {
    icon: require('assets/images/graphics/notification-icon/icon_email-authenticating.png'),
    text: t`LATEST DROP`,
  },
  {
    icon: require('assets/images/graphics/notification-icon/icon_email-storage.png'),
    text: t`PRICE ALERT`,
  },
  {
    icon: require('assets/images/graphics/notification-icon/icon_email-delivering.png'),
    text: t`SHIPPING`,
  },
  {
    icon: require('assets/images/graphics/notification-icon/icon_email-payout.png'),
    text: t`PAYOUTS`,
  },
];

const PushNotificationInfoDialog = () => {
  const isOpen = useStoreState((s) => s.pushNotificationDialog.isOpen);
  const closeDialog = useStoreActions((a) => a.pushNotificationDialog.closeDialog);
  const onClose = () => closeDialog();

  return (
    <Dialog center p={5} width={340} bg="white" onClose={onClose} isOpen={isOpen} dismissable>
      <Box p={2}>
        <Text textAlign="center" fontSize={4} fontFamily="bold">
          <Trans>DON'T MISS OUT</Trans>
        </Text>
        <Text textAlign="center" fontSize={2} mt={5} mb={3}>
          <Trans>
            Enable push notifications to stay on top of latest drops, order updates, price alerts,
            promotions and much more.
          </Trans>
        </Text>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" mt={4}>
          {notificationIcons.map(({ icon, text }, x) => (
            <Box center style={{ width: '25%' }} key={x}>
              <Box height={60} width={60}>
                <Image
                  style={{ flex: 1 }}
                  height={60}
                  width={60}
                  resizeMode="contain"
                  source={icon}
                />
              </Box>

              <Text textAlign="center" fontFamily="medium" mt={2} fontSize={0}>
                {i18n._(text)}
              </Text>
            </Box>
          ))}
        </Box>
        <Box py={2} mt={6}>
          <Button
            text={i18n._(t`TURN ON NOTIFICATIONS`)}
            variant="black"
            onPress={() => PushNotification.pushEnable(true).then(onClose)}
          />
          <Box mt={5} />
          <ButtonBase onPress={onClose}>
            <Text textAlign="center" fontSize={3} fontFamily="bold">
              <Trans>NOT NOW</Trans>
            </Text>
          </ButtonBase>
        </Box>
      </Box>
    </Dialog>
  );
};
export default PushNotificationInfoDialog;
