import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import Clipboard from '@react-native-community/clipboard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Box, Text } from 'app/components/base';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import ListItem from 'app/screens/product/components/common/ListItem';
import Analytics from 'app/services/analytics';
import { useStoreActions } from 'app/store';
import API from 'common/api';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { UserRoutes } from 'types/navigation';
import { UserType } from 'types/resources/user';
import { VoucherType } from 'types/resources/voucher';

const ExchangeRewardDialog = ({
  voucher,
  user,
  voucherCost,
  isExchangeRewardDialogOpen,
  toggleExchangeRewardDialog,
}: {
  user: UserType;
  voucher: VoucherType;
  voucherCost: number;
  isExchangeRewardDialogOpen: boolean;
  toggleExchangeRewardDialog: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const fetchUser = useStoreActions((a) => a.user.fetch);
  const navigation = useNavigation<StackNavigationProp<UserRoutes>>();

  const handleConfirm = () => {
    setLoading(true);

    return API.fetch<VoucherType>(`vouchers/${voucher.id}/buy/`)
      .then((res) => {
        fetchUser();
        Clipboard.setString(res.code);
        Analytics.redeemVoucher(res);
        navigation.goBack();
        Alert.alert(i18n._(t`Points redeemed`), i18n._(t`Promocode has been created and copied.`));
      })
      .catch((err) => {
        Alert.alert(i18n._(t`Points Exchange failed`), err);
      })
      .finally(() => {
        toggleExchangeRewardDialog();
        setLoading(false);
      });
  };

  return (
    <ConfirmDialog
      isOpen={isExchangeRewardDialogOpen}
      onConfirm={handleConfirm}
      title={i18n._(t`EXCHANGE CONFIRMATION`)}
      confirmText={i18n._(t`CONFIRM EXCHANGE`)}
      loading={loading}
    >
      <Box width="100%">
        <Text fontSize={2} textAlign="center" mt={4}>
          {voucher.name}
        </Text>
        <ListItem mt={5} my={2}>
          <Text fontSize={2}>
            <Trans>Total Points:</Trans>
          </Text>
          <Text fontSize={2}>
            <Trans>{user.points} NSP</Trans>
          </Text>
        </ListItem>
        <ListItem my={2}>
          <Text fontSize={2}>
            <Trans>Cost:</Trans>
          </Text>
          {voucherCost === voucher.cost ? (
            <Text fontSize={2}>
              <Trans>- {voucherCost} NSP</Trans>
            </Text>
          ) : (
            <Box flexDirection="row">
              <Text fontSize={2} style={{ textDecorationLine: 'line-through' }}>
                <Trans>-{voucher.cost} NSP</Trans>
              </Text>
              <Text fontSize={2} color="green">
                {' '}
                <Trans>-{voucherCost} NSP</Trans>
              </Text>
            </Box>
          )}
        </ListItem>
        <ListItem my={2}>
          <Text fontSize={2}>
            <Trans>New Balance:</Trans>
          </Text>
          <Text fontSize={2}>
            <Trans>{user.points - voucherCost} NSP</Trans>
          </Text>
        </ListItem>
        <Box borderTopWidth={1} mb={3} mt={3} borderTopColor="dividerGray" />
        <Text textAlign="center" mb={2} fontSize={1}>
          <Trans>Terms & Conditions:</Trans>
        </Text>
        <Box px={4}>
          <Box flexDirection="row" alignItems="center" py={1}>
            <Text color="gray1">{'\u2022'}</Text>
            <Text fontSize={1} ml={2} color="gray1">
              <Trans>Promocodes have a 1 year validity after exchange.</Trans>
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center" py={1}>
            <Text color="gray1">{'\u2022'}</Text>
            <Text fontSize={1} ml={2} color="gray1">
              <Trans>Valid for one time usage via purchase on Novelship.</Trans>
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center" py={1} mb={4}>
            <Text color="gray1">{'\u2022'}</Text>
            <Text fontSize={1} ml={2} color="gray1">
              <Trans>Not valid with other promotions or discounts.</Trans>
            </Text>
          </Box>
        </Box>
      </Box>
    </ConfirmDialog>
  );
};

export default React.memo(ExchangeRewardDialog);
