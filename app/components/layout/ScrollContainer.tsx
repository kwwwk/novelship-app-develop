import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

const ScrollContainer: React.FunctionComponent<ScrollViewProps> = (props) => (
  <ScrollView
    keyboardShouldPersistTaps="handled"
    overScrollMode="never"
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    {...props}
  />
);

export default ScrollContainer;
