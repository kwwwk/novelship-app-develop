import React from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { UserType } from 'types/resources/user';
import theme from 'app/styles/theme';
import ReviewProfileEditBar from './ReviewProfileEditBar';

const AddEmailBar = ({ user }: { user: UserType }) =>
  !user.email ? (
    <ReviewProfileEditBar
      label={i18n._(t`Email`)}
      isFilled={!!user.email}
      infoMissing={i18n._(t`Add Email Address`)}
      formName="ProfileForm"
      Icon={<MaterialCommunityIcon name="email-outline" size={20} color={theme.colors.textBlack} />}
    />
  ) : null;

export default AddEmailBar;
