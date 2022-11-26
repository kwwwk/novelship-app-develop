import theme from 'app/styles/theme';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

import React from 'react';

const LoadingIndicator: React.FunctionComponent<ActivityIndicatorProps> = ({
  color = theme.colors.gray3,
  size = 'small',
  ...props
}) => <ActivityIndicator color={color} size={size} {...props} />;

export default LoadingIndicator;
