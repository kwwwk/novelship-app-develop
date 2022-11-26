import React, { useContext, useEffect } from 'react';
import { i18n } from '@lingui/core';

import { Text, Box } from 'app/components/base';
import { OfferListType } from 'types/resources/offerList';
import { ScrollContainer } from 'app/components/layout';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import CheckBoxInput from 'app/components/form/CheckBox';
import { LB } from 'common/constants';
import { t, Trans } from '@lingui/macro';
import bulkListUtils from '../utils/bulk-list';
import ListCardProductInfo from '../../components/ListCardProductInfo';
import BulkListContext from '../context';

export type BulkListType = { id: number; new_price: number };

const BulkListTable = ({
  lists,
  screen,
}: {
  lists: OfferListType[];
  screen: 'bulkUpdate' | 'bulkReview';
}) => {
  const { editOption, editByValue, setEditByValue, selectedListsId, setSelectedListsId } =
    useContext(BulkListContext);

  const { $ } = useCurrencyUtils();
  const isBeatLowestList = editOption === 'beatLowestListByValue';

  const TableContent = isBeatLowestList
    ? [
        { title: t`Name` },
        { title: t`Lowest List` },
        { title: t`Current List` },
        { title: t`New List` },
      ]
    : [{ title: t`Name` }, { title: t`Current List` }, { title: t`New List` }];

  useEffect(() => {
    if (Number.isNaN(editByValue)) {
      setEditByValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editByValue]);

  return (
    <>
      <Box bg="gray6" height={28} flexDirection="row">
        {TableContent.map((content, index) => (
          <Box
            key={index}
            pl={index === 0 ? 5 : 0}
            width={index === 0 ? '46%' : isBeatLowestList ? '18%' : '27%'}
            justifyContent="center"
          >
            <Text fontSize={11} fontFamily="medium">
              {i18n._(content.title)}
            </Text>
          </Box>
        ))}
      </Box>

      <ScrollContainer>
        {lists.map((list) => {
          const { currency } = list;
          const isIRDCurrency = currency.code === 'IDR';
          const newListPrice = bulkListUtils.getNewListPrice(list, editByValue, editOption);
          return (
            <Box key={list.id} flexDirection="row" justifyContent="space-between">
              <Box alignItems="center" flexDirection="row" width="46%">
                {screen === 'bulkUpdate' && (
                  <Box pl={5}>
                    <CheckBoxInput
                      checked={selectedListsId.includes(list.id)}
                      onChecked={() => {
                        setSelectedListsId([...selectedListsId, list.id]);
                        if (selectedListsId.includes(list.id)) {
                          setSelectedListsId(selectedListsId.filter((item) => item !== list.id));
                        }
                      }}
                    />
                  </Box>
                )}
                <ListCardProductInfo
                  product={list.product}
                  size={list.local_size}
                  mt={4}
                  pl={screen === 'bulkUpdate' ? 0 : 5}
                  width={screen === 'bulkUpdate' ? '66%' : '90%'}
                />
              </Box>
              {isBeatLowestList && (
                <Box width="18%" justifyContent="center">
                  <Text fontSize={isIRDCurrency ? 0 : 1} fontFamily="medium">
                    {$(bulkListUtils.getLowestListPrice(list))}
                  </Text>
                </Box>
              )}
              <Box width={isBeatLowestList ? '18%' : '27%'} justifyContent="center">
                <Text fontSize={isIRDCurrency ? 0 : 1} fontFamily="medium">
                  {$(list.local_price, currency)}
                </Text>
              </Box>
              <Box width={isBeatLowestList ? '18%' : '27%'} justifyContent="center">
                {newListPrice < currency.min_list_price ? (
                  <Text fontSize={0} color="red" fontFamily="medium">
                    {$(newListPrice)}
                    {LB}
                    <Trans>{`Minimum is ${$(currency.min_list_price)}`}</Trans>
                  </Text>
                ) : (
                  <Text fontSize={isIRDCurrency ? 0 : 1} color="blue" fontFamily="medium">
                    {$(newListPrice)}
                  </Text>
                )}
              </Box>
            </Box>
          );
        })}
      </ScrollContainer>
    </>
  );
};

export default BulkListTable;
