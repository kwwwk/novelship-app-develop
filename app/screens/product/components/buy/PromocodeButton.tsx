import React, { useContext } from 'react';
import { Trans } from '@lingui/macro';
import Ionicon from 'react-native-vector-icons/Ionicons';

import theme from 'app/styles/theme';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { Box, ButtonBase, Text } from 'app/components/base';

import ProductCheckoutContext from '../../context';

const PromocodeButton = ({ selectPromocode }: { selectPromocode: () => void }) => {
  const { $$ } = useCurrencyUtils();
  const {
    buy: {
      promocode: { currentPromocode },
    },
  } = useContext(ProductCheckoutContext);

  return (
    <ButtonBase
      style={{
        borderColor: theme.colors.green,
        borderRadius: 4,
        borderWidth: 1,
      }}
      android_ripple={{ color: theme.colors.rippleGray }}
      onPress={selectPromocode}
    >
      <Box center flexDirection="row" minHeight={48} px={4} py={3}>
        <Box width="44%">
          <Text fontFamily="medium" fontSize={2} color="green">
            <Trans>Apply Promocode</Trans>
          </Text>
        </Box>
        <Box
          justifyContent="flex-end"
          alignItems="center"
          flexDirection="row"
          width="50%"
          style={{ marginLeft: 'auto' }}
        >
          {currentPromocode.value ? (
            <Box alignItems="flex-end" mr={3}>
              <Text fontSize={2} color="green" fontFamily="bold">
                -{$$(currentPromocode.value)}
              </Text>
              {currentPromocode.description && (
                <Text fontFamily="medium" fontSize={2} mb={1} numberOfLines={1}>
                  {currentPromocode.description}
                </Text>
              )}
              <Box
                borderStyle="dashed"
                borderColor="textBlack"
                borderWidth={1}
                borderRadius={6}
                px={4}
                py={1}
                mt={2}
                backgroundColor="gray7"
              >
                <Text fontSize={1}>{currentPromocode.code}</Text>
              </Box>
            </Box>
          ) : (
            <Text ml={3} fontSize={2} fontFamily="bold" mr={2} textAlign="right">
              <Trans>No Promocode Applied</Trans>
            </Text>
          )}

          <Ionicon name="md-chevron-forward" size={20} color={theme.colors.green} />
        </Box>
      </Box>
    </ButtonBase>
  );
};

export default PromocodeButton;
