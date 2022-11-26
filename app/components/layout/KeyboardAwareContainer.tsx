import React from 'react';
import { KeyboardAvoidingView, KeyboardAvoidingViewProps } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

const KeyboardAwareContainer: React.FunctionComponent<KeyboardAvoidingViewProps> = ({
  style,
  ...props
}) => {
  const verticalOffSet = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={verticalOffSet}
      style={[{ flex: 1 }, style]}
      {...props}
    />
  );
};

export default KeyboardAwareContainer;
