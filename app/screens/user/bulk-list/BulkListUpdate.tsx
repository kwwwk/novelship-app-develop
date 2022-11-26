import React, { useContext, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { i18n } from '@lingui/core';

import { Footer, KeyboardAwareContainer, SafeAreaScreenContainer } from 'app/components/layout';
import { Button, Text, Box } from 'app/components/base';
import Select from 'app/components/form/SelectInput';
import { useStoreState } from 'app/store';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';

import { BulkListRoutes, UserRoutes } from 'types/navigation';
import { Input } from 'app/components/form';
import { RouteProp, useRoute } from '@react-navigation/native';
import validOfferListsFilter, { productSkuSearchFilter } from 'common/constants/offerList';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import { OfferListType } from 'types/resources/offerList';
import { t, Trans } from '@lingui/macro';
import Analytics from 'app/services/analytics';
import BulkListContext, { BulkListEditType } from './context';
import BulkListTable from './components/BulkListTable';
import { currentListsParamsDefault } from './constants';
import bulkListUtils from './utils/bulk-list';

const BulkListUpdate = ({ navigation }: StackScreenProps<UserRoutes, 'BulkListEditStack'>) => {
  const currency = useStoreState((s) => s.currency.current);
  const [error, setError] = React.useState<string>('');

  const { $ } = useCurrencyUtils();
  const {
    editByValue,
    editOption,
    selectedListsId,
    setEditByValue,
    setEditOption,
    setSelectedListsId,
  } = useContext(BulkListContext);

  const route = useRoute<RouteProp<BulkListRoutes, 'BulkListUpdate'>>();
  const { selected_ids, is_select_all, search_term } = route.params;

  const selectedListsCount = selectedListsId.length;

  const currentListedParams = {
    ...currentListsParamsDefault,
    filter: {
      local_currency_id: currency.id,
      ...currentListsParamsDefault.filter,
      ...(is_select_all ? {} : { 'id:in': selected_ids.join(',') }),
      ...validOfferListsFilter,
    },
  };

  const { results: currentLists } = useAPIListFetch<OfferListType>(
    'me/offer-lists',
    currentListedParams,
    {
      refetchOnScreenFocus: true,
      filter: productSkuSearchFilter(search_term),
    }
  );

  type editOptionContentType = {
    value: BulkListEditType;
    label: string;
    placeholder: string;
    text: string;
  };

  const editOptionsContent: editOptionContentType[] = [
    {
      value: 'beatLowestListByValue',
      label: i18n._(t`Beat Lowest List`),
      placeholder: '-2',
      text: i18n._(
        t`${selectedListsCount} items will be beating the lowest list by ${$(editByValue)}.`
      ),
    },
    {
      value: 'decreaseByValue',
      label: i18n._(t`Decrease List Price`),
      placeholder: '-2',
      text: i18n._(
        t`${selectedListsCount} items will be updated with a price decrease of ${$(editByValue)}.`
      ),
    },
    {
      value: 'setToValue',
      label: i18n._(t`New List Price`),
      placeholder: '30',
      text: i18n._(
        t`${selectedListsCount} items will be changed to list price of ${$(editByValue)}.`
      ),
    },
    {
      value: 'increaseByValue',
      label: i18n._(t`Increase List Price`),
      placeholder: '+2',
      text: i18n._(
        t`${selectedListsCount} items will be updated with a price increase of ${$(editByValue)}.`
      ),
    },
  ];

  const option = editOptionsContent.find((e) => e.value === editOption) as editOptionContentType;
  const canProceed = selectedListsId.length > 0 && editByValue !== 0;

  const onUpdate = () => {
    if (bulkListUtils.checkIfInvalidLists(currentLists, editByValue, editOption)) {
      setError(i18n._(t`Please ensure that your lists are valid.`));
    } else {
      Analytics.bulkListEdit({
        operation: 'Review',
        edit_option: editOption,
        edit_value: editByValue,
      });
      navigation.navigate('BulkListEditStack', {
        screen: 'BulkListReview',
      });
    }
  };

  useEffect(() => {
    // @ts-ignore override
    setEditOption(editOption); // ???
    setEditByValue(0);
    setSelectedListsId(
      selectedListsId.length === 0 ? currentLists.map((li) => li.id) : selectedListsId
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editOption, currentLists]);

  useEffect(() => {
    if (error) {
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editByValue]);

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <Box style={[{ paddingHorizontal: 16 }]} mt={6}>
          <Box center width="100%" flexDirection="row" justifyContent="space-between">
            <Box width="80%" height="100%" minHeight={40}>
              <Select
                onChangeText={setEditOption as (arg: string) => void}
                items={editOptionsContent}
                value={editOption}
                style={{ height: 40 }}
              />
            </Box>
            <Box center width="20%">
              <Text fontSize={2} fontFamily="bold">
                {editOption === 'setToValue' ? <Trans>TO</Trans> : <Trans>BY</Trans>}
              </Text>
            </Box>
          </Box>
          <Box center width="100%" flexDirection="row" justifyContent="space-between" mt={3}>
            <Box width="80%">
              <Input
                placeholder={option.placeholder}
                value={editByValue ? editByValue.toString() : ''}
                keyboardType="numeric"
                onChangeText={(r) => setEditByValue(parseInt(r))}
                style={{ textAlign: 'center', height: 40 }}
              />
            </Box>
            <Box center width="20%">
              <Text fontSize={2} fontFamily="bold">
                {currency.code}
              </Text>
            </Box>
          </Box>

          <Box center mt={2} mb={3} px={5}>
            <Text fontSize={1} color="blue">
              {editByValue !== 0 && !Number.isNaN(editByValue) ? option.text : ''}
            </Text>
          </Box>
        </Box>

        <BulkListTable lists={currentLists} screen="bulkUpdate" />

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
                text={i18n._(t`REVIEW LISTS`)}
                onPress={onUpdate}
                disabled={!canProceed}
              />
            </Box>
          </>
        </Footer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

export default BulkListUpdate;
