import React from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Box, Text, ButtonBase } from 'app/components/base';
import theme from 'app/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootRoutes } from 'types/navigation';
import ListItem from './ListItem';

const ReviewProfileEditBar: React.FunctionComponent<{
  label: string;
  infoPresent?: React.ReactNode;
  infoMissing: React.ReactNode;
  Icon: React.ReactNode;
  isFilled: boolean;
  formName: 'BuyingForm' | 'SellingForm' | 'ProfileForm' | 'PhoneForm' | 'PushNotificationForm';
}> = ({ label, isFilled, formName, infoPresent, infoMissing, Icon }) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes, 'UserStack'>>();

  return (
    <ListItem mt={4}>
      <Box center flexDirection="row">
        {Icon}
        <Text ml={3} lineHeight={20} fontSize={2}>
          {label}
        </Text>
      </Box>
      <ButtonBase
        onPress={() => navigation.push('UserStack', { screen: formName })}
        style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}
      >
        {isFilled ? (
          <Text fontSize={2} textAlign="right" mr={3} style={{ width: 170 }}>
            {infoPresent}
          </Text>
        ) : (
          <Text fontSize={2} fontFamily="medium" textAlign="right" color="red" mr={3}>
            {infoMissing}
          </Text>
        )}
        <MaterialCommunityIcon
          name="pencil"
          size={20}
          color={theme.colors[isFilled ? 'textBlack' : 'red']}
        />
      </ButtonBase>
    </ListItem>
  );
};

export default ReviewProfileEditBar;
