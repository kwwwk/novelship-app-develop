import React, { useContext } from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import {
  Footer,
  ScrollContainer,
  KeyboardAwareContainer,
  SafeAreaScreenContainer,
} from 'app/components/layout';
import { RouteProp, useRoute } from '@react-navigation/native';

import { Button, Text, Box } from 'app/components/base';
import { BulkListRoutes, UserRoutes } from 'types/navigation';
import { LB } from 'common/constants';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import validOfferListsFilter from 'common/constants/offerList';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import { OfferListType } from 'types/resources/offerList';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import BulkListContext from './context';
import ConfirmationTick from '../../../components/icons/ConfirmationTick';
import ListCardProductInfo from '../components/ListCardProductInfo';
import { currentListsParamsDefault } from './constants';

const BulkListConfirmed = ({ navigation }: StackScreenProps<UserRoutes, 'BulkListEditStack'>) => {
  const { selectedListsId } = useContext(BulkListContext);
  const { $ } = useCurrencyUtils();

  const route = useRoute<RouteProp<BulkListRoutes, 'BulkListConfirmed'>>();
  const { confirmed_lists } = route.params;

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
    { refetchOnScreenFocus: true }
  );
  const TableContent = [{ title: t`Name` }, { title: t`Current List` }, { title: t`New List` }];

  const getCurrentListPrice = (listId: number) =>
    confirmed_lists.find((li) => li.id === listId)?.old_price || 0;

  const getNewListPrice = (listId: number) =>
    confirmed_lists.find((li) => li.id === listId)?.new_price || 0;

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <Box style={[{ paddingHorizontal: 16 }]} mt={4}>
          <Box pb={6}>
            <Box center mt={5}>
              <ConfirmationTick />
              <Text fontFamily="bold" textTransform="uppercase" mt={3} fontSize={4}>
                <Trans>Congratulations!</Trans>
              </Text>
            </Box>

            <Text mt={4} textAlign="center" fontSize={1}>
              <Trans>
                Your lists are now being updated!{LB}
                NOTE: It may take a couple of minutes for all new List prices to be reflected on
                your selling page.
              </Trans>
            </Text>
          </Box>
        </Box>
        <>
          <Box bg="gray6" height={40} flexDirection="row" mt={2}>
            {TableContent.map((content, index) => (
              <Box
                key={index}
                pl={index === 0 ? 5 : 0}
                width={index === 0 ? '40%' : '30%'}
                justifyContent="center"
              >
                <Text fontSize={1} fontFamily="medium">
                  {i18n._(content.title)}
                </Text>
              </Box>
            ))}
          </Box>
          <ScrollContainer>
            {currentlyListed.map((li) => (
              <Box key={li.id} flexDirection="row" justifyContent="space-between">
                <Box alignItems="center" flexDirection="row" width="40%">
                  <ListCardProductInfo
                    product={li.product}
                    size={li.local_size}
                    mt={4}
                    pl={5}
                    width="90%"
                  />
                </Box>

                <Box width="30%" justifyContent="center">
                  <Text fontSize={1} fontFamily="bold">
                    {$(getCurrentListPrice(li.id), li.currency)}
                  </Text>
                </Box>
                <Box pl={2} width="30%" justifyContent="center">
                  <Text fontSize={1} color="blue" fontFamily="bold">
                    {$(getNewListPrice(li.id), li.currency)}
                  </Text>
                </Box>
              </Box>
            ))}
          </ScrollContainer>
        </>

        <Footer>
          <Button
            variant="black"
            size="md"
            text={i18n._(t`VIEW MY LISTS`)}
            onPress={() => navigation.navigate('Selling', { screen: 'Lists' })}
          />
        </Footer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

export default BulkListConfirmed;
