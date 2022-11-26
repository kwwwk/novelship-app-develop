import * as React from 'react';
import { Box, Text } from 'app/components/base';
import theme from 'app/styles/theme';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStoreState } from 'app/store';

const ShipmentPendingAlert = ({
  children,
  shippingStats,
}: {
  children?: React.ReactNode;
  shippingStats?: { has_to_ship: boolean; has_to_ship_delayed?: boolean };
}) => {
  const {
    has_to_ship_delayed = false,
    has_to_ship,
  }: { has_to_ship: boolean; has_to_ship_delayed?: boolean } =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    shippingStats || useStoreState((s) => s.user.user.shipping_stats);

  return children ? (
    <Box style={{ position: 'relative' }} flexDirection="row" alignItems="center">
      {children}
      {has_to_ship_delayed ? (
        <Box style={styles.redAlertFloating}>
          <MaterialCommunityIcon name="alert-circle" size={11} color={theme.colors.red} />
        </Box>
      ) : has_to_ship ? (
        <Box style={styles.redDotFloating} />
      ) : (
        <></>
      )}
    </Box>
  ) : (
    <Text p={1}>
      {has_to_ship_delayed ? (
        <MaterialCommunityIcon name="alert-circle" size={12} color={theme.colors.red} />
      ) : has_to_ship ? (
        <Box style={styles.redDot} />
      ) : (
        <></>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  redAlertFloating: {
    position: 'absolute',
    right: -12,
    top: 0,
  },
  redDot: {
    backgroundColor: theme.colors.red,
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
  },
  redDotFloating: {
    position: 'absolute',
    right: -4,
    top: 1,
    backgroundColor: theme.colors.red,
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
  },
});

export default ShipmentPendingAlert;
