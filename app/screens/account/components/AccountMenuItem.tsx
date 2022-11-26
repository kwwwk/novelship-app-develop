import * as React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { ButtonBase, Text, Box } from 'app/components/base';
import theme from 'app/styles/theme';
import { Linking } from 'react-native';

const MenuItem = ({
  text,
  subText,
  icon,
  CustomIcon = React.Fragment,
  link,
  onPress,
  action = () => {},
  Wrap = React.Fragment,
}: {
  text: string;
  subText?: string;
  icon?: string;
  CustomIcon?: React.FC;
  link?: string;
  onPress?: () => void;
  action?: () => void;
  Wrap?: React.FC;
}) => (
  <ButtonBase
    onPress={
      link
        ? () => {
            Linking.openURL(link);
            action();
          }
        : onPress
    }
  >
    <Box
      py={5}
      mt={1}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ borderColor: theme.colors.dividerGray, borderBottomWidth: 1 }}
    >
      <Box alignItems="center" flexDirection="row">
        <CustomIcon />
        {icon && (
          <Box mr={5}>
            <Ionicon name={icon} size={22} color={theme.colors.textBlack} />
          </Box>
        )}
        <Box>
          <Wrap>
            <Text fontFamily="medium" fontSize={3} color="textBlack">
              {text}
            </Text>
          </Wrap>
          {subText && (
            <Text fontFamily="regular" fontSize={1} color="textSecondary">
              {subText}
            </Text>
          )}
        </Box>
      </Box>
      <Ionicon name="chevron-forward" size={22} color={theme.colors.textBlack} />
    </Box>
  </ButtonBase>
);

export default MenuItem;
