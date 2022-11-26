import React from 'react';
import { Text, Box } from 'app/components/base';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { UserType } from 'types/resources/user';
import type { PaymentMethodType } from 'types/resources/paymentMethod';

const PaymentPromotionText: React.FC<{
  user: UserType;
  payment: PaymentMethodType;
}> = ({ user, payment }) => {
  const promoText = payment.promotion_text?.[user.country.shortcode] || payment.promotion_text?.All;

  if (!promoText) return null;

  return (
    <Box
      center
      px={4}
      py={2}
      my={1}
      borderRadius={18}
      bg="goldenrod"
      flexDirection="row"
      style={{ marginRight: 'auto' }}
    >
      <Box mr={1}>
        <MaterialCommunityIcon name="tag-outline" size={12} color="black" />
      </Box>
      <Text
        textAlign="center"
        fontFamily="medium"
        textTransform="uppercase"
        fontSize={0}
        ml={1}
        color="textBlack"
      >
        {promoText}
      </Text>
    </Box>
  );
};

export default PaymentPromotionText;
