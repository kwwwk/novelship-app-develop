import React, { useContext } from 'react';
import { Box, ImgixImage, Text } from 'app/components/base';
import CheckBoxInput from 'app/components/form/CheckBox';
import { getImgixUrl } from 'common/constants';
import Counter from 'app/components/misc/Counter';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { Trans } from '@lingui/macro';
import HintDialog from 'app/components/dialog/HintDialog';
import ProductCheckoutContext from '../../context';

const ProductAddOnSelect = () => {
  const {
    buy: {
      productAddOn: { addOn, quantity, price, setQuantity },
      buy,
    },
  } = useContext(ProductCheckoutContext);
  const { $$ } = useCurrencyUtils();

  const ProductAddOnInfoDialog = () => (
    <HintDialog>
      <Box center p={1}>
        <Text fontFamily="medium" fontSize={3} mb={5}>
          {addOn?.name}
        </Text>
        <ImgixImage src={getImgixUrl(addOn?.image || '')} height={160} width={160} />
        <Text textAlign="justify" fontSize={2} mt={4} mx={3} lineHeight={16}>
          {addOn?.description}
        </Text>
      </Box>
    </HintDialog>
  );

  if (!addOn?.id || buy.isOffer || buy.deliver_to === 'storage') return null;

  return (
    <>
      <Box height={1} bg="dividerGray" mb={2} mt={3} />
      <Text fontFamily="bold" mt={5} fontSize={3}>
        <Trans>ADD-ON PRODUCT</Trans>
      </Text>
      <Box
        flexDirection="row"
        borderWidth={1}
        borderColor="dividerGray"
        borderRadius={4}
        p={4}
        my={3}
      >
        <CheckBoxInput
          checked={quantity > 0}
          onChecked={() => setQuantity(quantity === 0 ? 1 : 0)}
        />
        <Box flex={1}>
          <Box flexDirection="row" alignItems="center">
            <ImgixImage src={getImgixUrl(addOn.image)} height={48} width={60} />
            <Box ml={4}>
              <Box flexDirection="row" alignItems="center">
                <Text fontFamily="bold" fontSize={2}>
                  {addOn.name}
                </Text>
                <Text>
                  &nbsp;
                  <ProductAddOnInfoDialog />
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center" mt={1} maxWidth={100}>
                <Text color="gray2" fontSize={1}>
                  <Trans>SKU:</Trans> {addOn.sku}
                </Text>
                <Box width={1} height={11} mx={4} bg="dividerGray" />
                <Text color="gray2" fontSize={1} lineHeight={20}>
                  <Trans>Size:</Trans> {addOn.sizes.join(', ').toUpperCase()}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            mt={3}
          >
            <Text fontSize={2}>
              <Trans>Quantity</Trans>
            </Text>
            <Counter
              max={Math.min(3, addOn.stock)}
              setCount={setQuantity}
              count={quantity}
              textProps={{ fontSize: 2, fontFamily: 'bold' }}
            />
          </Box>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            mt={2}
          >
            <Text fontSize={2}>
              <Trans>Price</Trans>
            </Text>
            {!!addOn.price && <Text fontSize={2}>{$$(price || addOn.price)}</Text>}
          </Box>
        </Box>
      </Box>
      <Box height={1} bg="dividerGray" mt={3} mb={5} />
    </>
  );
};
export default React.memo(ProductAddOnSelect);
