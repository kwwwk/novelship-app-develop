import React, { useContext, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import API from 'common/api';

import { Footer, KeyboardAwareContainer, SafeAreaScreenContainer } from 'app/components/layout';
import { Button, Text, Box } from 'app/components/base';
import { UserRoutes } from 'types/navigation';
import CheckBoxInput from 'app/components/form/CheckBox';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import validOfferListsFilter from 'common/constants/offerList';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import { OfferListType } from 'types/resources/offerList';
import Analytics from 'app/services/analytics';
import bulkListUtils from './utils/bulk-list';
import ExpirationSelect from '../../product/components/common/ExpirationSelect';
import BulkListTable from './components/BulkListTable';
import BulkListContext, { BulkListEditType } from './context';
import { currentListsParamsDefault } from './constants';

const BulkListReview = ({ navigation }: StackScreenProps<UserRoutes, 'BulkListEditStack'>) => {
  const { expiration, setExpiration, editByValue, selectedListsId, editOption } =
    useContext(BulkListContext);

  const [newCheck, setNewCheck] = useState<boolean>(true);
  const [shipCheck, setShipCheck] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const { $ } = useCurrencyUtils();
  const canProceed = newCheck && shipCheck;
  const selectedListsCount = selectedListsId.length;

  const currentListedParams = {
    ...currentListsParamsDefault,
    filter: {
      'id:in': selectedListsId.join(','),
      ...currentListsParamsDefault.filter,
      ...validOfferListsFilter,
    },
  };

  const { results: currentlyListed } = useAPIListFetch<OfferListType>(
    'me/offer-lists',
    currentListedParams,
    {
      refetchOnScreenFocus: true,
    }
  );

  type expirationContentType = {
    value: BulkListEditType;
    text: string;
  };

  const expirationContent: expirationContentType[] = [
    {
      value: 'increaseByValue',
      text: i18n._(
        t`${selectedListsCount} items will be updated with a price increase of ${$(
          editByValue
        )} and their list expiration extended by ${expiration}.`
      ),
    },
    {
      value: 'decreaseByValue',
      text: i18n._(
        t`${selectedListsCount} items will be updated with a price decrease of ${$(
          editByValue
        )} and their list expiration extended by ${expiration}.`
      ),
    },
    {
      value: 'beatLowestListByValue',
      text: i18n._(
        t`${selectedListsCount} items will be beating the lowest list by ${$(
          editByValue
        )} and their list expiration extended by ${expiration}.`
      ),
    },
    {
      value: 'setToValue',
      text: i18n._(
        t`${selectedListsCount} items will be changed to list price of ${$(
          editByValue
        )} and their list expiration extended by ${expiration}.`
      ),
    },
  ];

  const bulkListMsg = expirationContent.find(
    (e) => e.value === editOption
  ) as expirationContentType;

  const getUpdatedLists = () =>
    currentlyListed.map((list) => ({
      id: list.id,
      size: list.size,
      product_id: list.product.id,
      new_price: bulkListUtils.getNewListPrice(list, editByValue, editOption),
      old_price: list.local_price,
    }));

  const updateLists = () => {
    setIsLoading(true);
    const lists = getUpdatedLists();

    return API.put(`me/offer-lists/lists-edit`, { lists, expiration })
      .then(() => {
        Analytics.bulkListEdit({
          operation: 'Confirm',
          edit_option: editOption,
          edit_value: editByValue,
          updated_lists: getUpdatedLists(),
        });
        navigation.navigate('BulkListEditStack', {
          screen: 'BulkListConfirmed',
          params: { confirmed_lists: lists },
        });
      })
      .finally(() => setIsLoading(false));
  };

  const onConfirm = () => {
    if (bulkListUtils.checkIfInvalidLists(currentlyListed, editByValue, editOption)) {
      setError(i18n._(t`Please ensure that your lists are valid.`));
    } else {
      updateLists();
    }
  };

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <Box style={[{ paddingHorizontal: 16 }]} mt={4}>
          <Text textAlign="center" fontSize={3} fontFamily="bold">
            <Trans>YOUR LISTS ARE ABOUT TO GO LIVE!</Trans>
          </Text>
          <Box center mb={2}>
            <Text mt={5} mb={4} fontSize={1} fontFamily="bold">
              <Trans>EXTEND LISTS EXPIRATION BY</Trans>
            </Text>
            <ExpirationSelect
              selected={expiration}
              onSelect={setExpiration}
              expirationDays={[30, 60, 90]}
            />
          </Box>
          <CheckBoxInput checked={shipCheck} onChecked={setShipCheck}>
            <Text color="gray1" fontSize={1} lineHeight={15}>
              <Trans>
                I have the products on hand and upon sale, I will ship out within 2 business days to
                avoid penalties.
              </Trans>
            </Text>
          </CheckBoxInput>
          <Box style={{ marginTop: -8 }}>
            <CheckBoxInput checked={newCheck} onChecked={setNewCheck}>
              <Text color="gray1" fontSize={1} lineHeight={15}>
                <Trans>My item(s) is brand new and unworn.</Trans>
              </Text>
            </CheckBoxInput>
          </Box>
        </Box>
        <Box center mt={2} mb={3} px={5}>
          <Text fontSize={1} color="blue" textAlign="center">
            {bulkListMsg.text}
          </Text>
        </Box>
        <BulkListTable lists={currentlyListed} screen="bulkReview" />
      </KeyboardAwareContainer>

      <Footer>
        <>
          {!!error && (
            <Text color="red" fontSize={13} mb={3}>
              {error}
            </Text>
          )}
          <Box>
            <Button
              variant="black"
              size="md"
              text={i18n._(t`CONFIRM LISTS`)}
              onPress={onConfirm}
              disabled={!canProceed}
              loading={isLoading}
            />
          </Box>
        </>
      </Footer>
    </SafeAreaScreenContainer>
  );
};

export default BulkListReview;
