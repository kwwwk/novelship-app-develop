import { TransactionSellerType } from 'types/resources/transactionSeller';
import { RootRoutes } from 'types/navigation';
import { UserType } from 'types/resources/user';

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import { Trans } from '@lingui/macro';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ButtonBase, Text, Box } from 'app/components/base';
import { addressString } from 'common/utils/address';
import { TextProps } from 'app/components/base/Text';
import { Radio } from 'app/components/form';
import { LB } from 'common/constants';

const RadioButton = ({
  value,
  options,
  onChange,
  formatFunc = (_) => String(_),
  returnIndex = false,
}: {
  value: string;
  options: (string | number | Date)[];
  onChange: (_: string) => void;
  formatFunc?: (_: string | number | Date) => string;
  returnIndex?: boolean;
}) => (
  <Radio.Group<string> value={value} setValue={(v: string) => onChange(v)}>
    {options.map((date, i) => (
      <Radio.Button
        value={String(returnIndex ? i : date)}
        justifyContent="space-between"
        flexDirection="row-reverse"
        alignItems="center"
        key={i}
        py={2}
      >
        <Text mt={3} fontSize={2} fontFamily="bold" textTransform="uppercase">
          {formatFunc(date)}
        </Text>
      </Radio.Button>
    ))}
  </Radio.Group>
);

const TitleText = (props: TextProps) => (
  <Text fontSize={4} fontFamily="bold" textTransform="uppercase" {...props} />
);

const PickupFrom = ({ user, sale }: { user: UserType; sale: TransactionSellerType }) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();

  return (
    <>
      <Box mt={3} flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text mt={6} mb={2} fontSize={3} fontFamily="bold">
          <Trans>Pick Up Address</Trans>
        </Text>
        <ButtonBase
          onPress={() =>
            navigation.push('UserStack', { screen: 'SellingForm', params: { limited: true } })
          }
        >
          <MaterialCommunityIcon name="pencil" size={20} color="textBlack" />
        </ButtonBase>
      </Box>
      <Text mt={2} color="gray2">
        {addressString(user.shipping_address, sale.seller_country)}
      </Text>

      <Text mt={6} mb={2} fontSize={3} fontFamily="bold">
        <Trans>Shipper’s Information</Trans>
      </Text>
      <Text mt={2} color="gray2">
        Email: {user.email}
        {LB}
        Phone: {user.shipping_address.country_code || user.country_code}
        {user.shipping_address.phone || user.phone}
      </Text>
    </>
  );
};

export { RadioButton, PickupFrom, TitleText };
