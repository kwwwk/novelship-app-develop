import React, { useState } from 'react';
import { Alert } from 'react-native';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import API from 'common/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { OfferListType } from 'types/resources/offerList';
import { ProductRoutes } from 'types/navigation';
import { ButtonBase, Box, Button } from 'app/components/base';
import theme from 'app/styles/theme';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import Analytics from 'app/services/analytics';

const DeleteOfferList = ({
  offerList,
  refetch,
  buttonMode,
}: {
  offerList: OfferListType;
  refetch: () => void;
  buttonMode: 'icon' | 'button-text';
}) => {
  const navigation = useNavigation<StackNavigationProp<ProductRoutes, 'Product'>>();

  const [isDeleting, setIsDeleting] = useState(false);
  const mode = offerList.type === 'buying' ? 'Offer' : 'List';

  const remove = () => {
    setIsDeleting(true);
    API.remove(`me/offer-lists/remove/${offerList.id}`).then(() => {
      Analytics.deleteOfferList(mode, offerList);
      refetch();
      navigation.goBack();
    });
  };

  const showOfferListDeleteDialog = () =>
    Alert.alert(
      offerList.type === 'buying' ? i18n._(t`Delete Offer`) : i18n._(t`Delete List`),
      offerList.type === 'buying'
        ? i18n._(t`Are you sure you want to delete your offer?`)
        : i18n._(t`Are you sure you want to delete your list?`),
      [
        { text: i18n._(t`Dismiss`), style: 'cancel' },
        {
          text: offerList.type === 'buying' ? i18n._(t`Delete Offer`) : i18n._(t`Delete List`),
          onPress: () => remove(),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );

  return buttonMode === 'icon' ? (
    <Box center>
      <ButtonBase
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={showOfferListDeleteDialog}
        android_ripple={{ color: theme.colors.rippleGray, borderless: true }}
      >
        {isDeleting ? (
          <LoadingIndicator color={theme.colors.white} />
        ) : (
          <Ionicon
            name="ios-trash-outline"
            size={theme.constants.HEADER_ICON_SIZE}
            color={theme.colors.white}
          />
        )}
      </ButtonBase>
    </Box>
  ) : (
    <Box px={5} my={8}>
      <Button
        variant="red-inverted"
        width="100%"
        onPress={showOfferListDeleteDialog}
        loading={isDeleting}
        text={offerList.type === 'buying' ? i18n._(t`DELETE OFFER`) : i18n._(t`DELETE LIST`)}
      />
    </Box>
  );
};

export default DeleteOfferList;
