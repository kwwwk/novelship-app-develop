import React, { useState } from 'react';
import { ButtonBase, Text, Box } from 'app/components/base';
import theme from 'app/styles/theme';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Trans } from '@lingui/macro';

const NotificationPanel = ({
  title,
  subTitle,
  type,
  children,
}: {
  title: string;
  subTitle: string;
  type: 'email' | 'push' | 'both';
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const onChangeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'));
    setIsExpanded((_isExpanded) => !_isExpanded);
  };

  return (
    <ButtonBase onPress={onChangeLayout}>
      <Box
        my={1}
        pt={3}
        pb={3}
        flexDirection="row"
        alignItems="flex-start"
        style={{
          borderBottomColor: theme.colors.dividerGray,
          borderBottomWidth: 1,
        }}
      >
        <Box flex={1}>
          <Box width="100%" justifyContent="space-between">
            <Box alignItems="center" flexDirection="row" justifyContent="space-between">
              <Text fontSize={2}>{title}</Text>
              <ButtonBase
                onPress={onChangeLayout}
                android_ripple={{ color: theme.colors.rippleGray, borderless: true }}
                style={{ marginRight: 4 }}
              >
                <Ionicon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} />
              </ButtonBase>
            </Box>
            <Text mb={2} color="gray3" fontSize={1} fontFamily="regular">
              {isExpanded ? (
                subTitle
              ) : type === 'both' ? (
                <Trans>Email, Push</Trans>
              ) : type === 'email' ? (
                <Trans>Email</Trans>
              ) : (
                <Trans>Push</Trans>
              )}
            </Text>
          </Box>
          {isExpanded && <Box style={{ height: isExpanded ? undefined : 0 }}>{children}</Box>}
        </Box>
      </Box>
    </ButtonBase>
  );
};

export default NotificationPanel;
