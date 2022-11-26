import React from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { UserType } from 'types/resources/user';
import theme from 'app/styles/theme';
import ReviewProfileEditBar from './ReviewProfileEditBar';

const AddPhoneBar = ({ user }: { user: UserType }) =>
  !user.phone ? (
    <ReviewProfileEditBar
      label={i18n._(t`Phone`)}
      isFilled={!!user.phone}
      infoMissing={i18n._(t`Add Phone Number`)}
      formName="PhoneForm"
      Icon={<MaterialCommunityIcon name="phone" size={20} color={theme.colors.textBlack} />}
    />
  ) : null;

export default AddPhoneBar;
