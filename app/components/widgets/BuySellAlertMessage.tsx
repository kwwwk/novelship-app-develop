import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Box, Text } from 'app/components/base';
import { LB } from 'common/constants';
import HintDialog from '../dialog/HintDialog';

const BuySellAlertMessage: React.FunctionComponent = ({ children }) => (
  <Box bg="alert" px={5} py={3} flexDirection="row">
    <Box mr={1} mt={1}>
      <Ionicon name="alert-circle-outline" size={26} color="white" />
    </Box>
    <Box pl={3} pr={5}>
      {children || (
        <>
          <Text fontFamily="bold" color="white" fontSize={2}>
            HOLIDAY SEASON DELAYS
          </Text>

          <HintDialog
            hintContent={
              <Text color="white" fontSize={1} textDecorationLine="underline">
                LEARN MORE
              </Text>
            }
          >
            <Box center p={2}>
              <Text fontFamily="bold" fontSize={3} mb={4}>
                HOLIDAY SEASON DELAYS
              </Text>
              <Text textAlign="center" fontSize={2} mx={4}>
                Due to overwhelming order numbers during the holiday season, please expect logistics
                delays and allow our customer service team more time to respond to your queries.{' '}
                {LB}
                Thank you.
              </Text>
            </Box>
          </HintDialog>
        </>
      )}
    </Box>
  </Box>
);

export default BuySellAlertMessage;
