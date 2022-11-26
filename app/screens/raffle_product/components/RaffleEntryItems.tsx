import { RaffleRoutes } from 'types/navigation';

import React, { useContext } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Trans } from '@lingui/macro';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Box, ButtonBase, Text } from 'app/components/base';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import theme from 'app/styles/theme';
import ListItem from 'app/screens/product/components/common/ListItem';
import RaffleProductCheckoutContext from '../context';

const RaffleEntryItems = ({ size }: { size?: string }) => {
  const { raffleProduct } = useContext(RaffleProductCheckoutContext);

  const offerPrice = raffleProduct.price;
  const { $$ } = useCurrencyUtils();

  const navigation = useNavigation<StackNavigationProp<RaffleRoutes, 'RaffleProductReview'>>();

  return (
    <Box>
      {size !== 'OS' && (
        <ListItem>
          <Text fontFamily="medium">
            <Trans>Size</Trans>
          </Text>
          <ButtonBase
            onPress={() => navigation.navigate('RaffleProductSizes')}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text fontFamily="bold" mr={3}>
              {size}
            </Text>
            <MaterialCommunityIcon name="pencil" size={20} color={theme.colors.textBlack} />
          </ButtonBase>
        </ListItem>
      )}

      <ListItem>
        <Text fontFamily="medium">
          <Trans>Product Price</Trans>
        </Text>
        <Text fontFamily="medium">{$$(offerPrice)}</Text>
      </ListItem>

      <ListItem>
        <Box flexDirection="row">
          <Text fontFamily="medium">
            <Trans>Delivery</Trans>
          </Text>
        </Box>
        <Text fontFamily="medium">{$$(0)}</Text>
      </ListItem>

      <ListItem>
        <Text>
          <Text fontFamily="medium">
            <Trans>Processing Fee</Trans>&nbsp;(0%)
          </Text>
        </Text>
        <Text fontFamily="medium">{$$(0)}</Text>
      </ListItem>

      <ListItem>
        <Text>
          <Text fontFamily="bold">
            <Trans>Total Price</Trans>
          </Text>
        </Text>
        <Text fontFamily="bold">{$$(offerPrice)}</Text>
      </ListItem>
    </Box>
  );
};

export default RaffleEntryItems;
