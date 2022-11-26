import React from 'react';
import { StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/macro';

import { Text, Box } from 'app/components/base';
import theme from 'app/styles/theme';

const SaleProgressFlow = ({
  progress,
  progressIndex,
  ...props
}: {
  progress: string[];
  progressIndex: number;
}) => (
  <Box p={5} pt={4} width="100%" {...props}>
    <Text mb={8} fontSize={2} fontFamily="bold" textAlign="center">
      <Trans>STATUS UPDATES</Trans>
    </Text>
    {progress.map((p: string, i: number) => (
      <Box ml={3} key={i}>
        <Box alignItems="center" flexDirection="row">
          <Ionicon
            size={21}
            color={theme.colors[progressIndex >= i ? 'black2' : 'gray3']}
            name={`checkmark-circle${progressIndex >= i ? '' : '-outline'}`}
          />
          <Text
            ml={6}
            fontSize={1}
            fontFamily="bold"
            textTransform="uppercase"
            color={progressIndex >= i ? 'black2' : 'gray3'}
          >
            {i18n._(p)}
          </Text>
        </Box>
        {i !== progress.length - 1 && (
          <Box height={20} borderLeftWidth={1} borderLeftColor="gray3" style={styles.divider} />
        )}
      </Box>
    ))}
  </Box>
);

const styles = StyleSheet.create({
  divider: {
    marginBottom: -3,
    marginLeft: 9,
    marginTop: -3,
  },
});

export default SaleProgressFlow;
