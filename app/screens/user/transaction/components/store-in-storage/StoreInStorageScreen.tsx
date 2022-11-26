import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';

import {
  SafeAreaScreenContainer,
  ScrollContainer,
  PageContainer,
  Footer,
  KeyboardAwareContainer,
} from 'app/components/layout';
import { Button, Box } from 'app/components/base';
import ProductImageHeader from 'app/screens/product/components/common/ProductImageHeader';
import useToggle from 'app/hooks/useToggle';

import { TransactionBuyerType } from 'types/resources/transactionBuyer';
import { SALE_STATUS_BUYER_TO_STORAGE_AVAILABLE } from 'common/constants/transaction';
import API from 'common/api';
import { useStoreState } from 'app/store';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootRoutes, UserRoutes } from 'types/navigation';
import { cacheGet, cacheSet } from 'app/services/asyncStorage';
import StoreInStorageConfirmDialog from './StoreInStorageConfirmDialog';
import PostPurchaseButton from '../post-purchase/PostPurchaseButton';
import StoreInStorageNotes from './StoreInStorageNotes';
import ResellInfoDialog from './ResellInfoDialog';

type StoreInStorageNavigationProp = CompositeNavigationProp<
  StackNavigationProp<UserRoutes, 'StoreInStorage'>,
  StackNavigationProp<RootRoutes, 'ProductStack'>
>;

const ResellScreen = ({ transaction }: { transaction: TransactionBuyerType }) => {
  const navigation = useNavigation<StoreInStorageNavigationProp>();
  const user = useStoreState((s) => s.user.user);

  const [loading, setLoading] = useState<boolean>(false);
  const [confirmationDialog, confirmationDialogToggle] = useToggle(false);
  const [show, setShow] = useState(false);

  const disableDeliverToStorage = !!(
    transaction.deliver_to === 'storage' ||
    transaction.buyer_delivery_declared ||
    !SALE_STATUS_BUYER_TO_STORAGE_AVAILABLE.includes(transaction.status)
  );

  const canProceed = user.country.storage_delivery_enabled && !disableDeliverToStorage;

  const storageDeliverError = (error: string) => {
    setLoading(false);

    return Alert.alert(
      '',
      error,
      [
        {
          text: i18n._(t`RETRY`),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const afterCreate = () => {
    setLoading(false);
    navigation.push('StoreInStorageConfirmed', {
      sale_ref: transaction.ref,
    });
  };

  const confirmStoreInStorage = () => {
    setLoading(true);
    API.fetch(`me/sales/${transaction.ref}/store-in-storage`)
      .then(afterCreate)
      .catch(storageDeliverError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cacheGet<boolean>('resell_dialog').then((d) => {
      if (d === undefined) {
        cacheSet('resell_dialog', true);
        setShow(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer behavior="position">
        <ScrollContainer>
          <ProductImageHeader
            transactionRef={transaction.ref}
            p={5}
            size={transaction.local_size}
            product={transaction.product}
            borderBottomWidth={1}
            borderBottomColor="gray6"
          />
          <PageContainer py={4} px={5}>
            <Box mt={4} width="100%" justifyContent="center" mb={5} alignItems="center">
              <Box flex={1} ml={2} width="50%">
                <PostPurchaseButton
                  iconSrc="icons/deliver_to_storage.png"
                  selected
                  disabled={disableDeliverToStorage}
                >
                  <Trans>Resell/Storage</Trans>
                </PostPurchaseButton>
              </Box>
            </Box>

            <StoreInStorageNotes />
          </PageContainer>
        </ScrollContainer>
      </KeyboardAwareContainer>

      <Footer>
        <Button
          text={i18n._(t`CONFIRM`)}
          onPress={confirmationDialogToggle}
          variant="black"
          size="lg"
          loading={loading}
          disabled={!canProceed}
        />
      </Footer>

      <StoreInStorageConfirmDialog
        isOpen={confirmationDialog}
        onConfirm={confirmStoreInStorage}
        toggleDialog={confirmationDialogToggle}
        title={i18n._(t`CONFIRM`)}
      />
      <ResellInfoDialog isOpen={show} onClose={() => setShow(false)} />
    </SafeAreaScreenContainer>
  );
};

export default ResellScreen;
