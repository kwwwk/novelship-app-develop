// @flow
import React from 'react';
import { Box, Text } from 'app/components/base';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import theme from 'app/styles/theme';

const CHECKS = [
  {
    id: 1,
    match: /^.{8,256}$/,
    text: i18n._(t`From 8 to 25 characters`),
  },
  {
    id: 2,
    match: /.*[A-Z].*/,
    text: i18n._(t`At least one capital letter`),
  },
  {
    id: 3,
    match: /.*[a-z].*/,
    text: i18n._(t`At least one lowercase letter`),
  },
  {
    id: 4,
    match: /.*\d.*/,
    text: i18n._(t`At least one number`),
  },
];

const PasswordCheck = ({ password }: { password: string }) => (
  <>
    {CHECKS.map((check) => (
      <Box alignItems="center" flexDirection="row" key={check.id}>
        {check.match.test(password) ? (
          <FontAwesome name="check" size={16} color={theme.colors.green} />
        ) : (
          <FontAwesome name="times" size={16} color={theme.colors.red} />
        )}
        <Text pl={2} fontSize={2} color="gray1">
          {check.text}
        </Text>
      </Box>
    ))}
  </>
);

export default PasswordCheck;
