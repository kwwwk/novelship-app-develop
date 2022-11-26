import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

function FlatListContainer<T>(props: FlatListProps<T>, ref?: React.ForwardedRef<FlatList>) {
  return (
    <FlatList<T>
      ref={ref}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
      onEndReachedThreshold={0.2}
      {...props}
    />
  );
}

export default React.forwardRef(FlatListContainer) as <T>(
  p: FlatListProps<T> & { ref?: React.ForwardedRef<FlatList> }
) => JSX.Element;
