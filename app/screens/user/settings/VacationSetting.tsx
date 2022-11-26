import React, { useState } from 'react';
import { Alert } from 'react-native';
import API from 'common/api';
import { useStoreActions } from 'app/store';
import { Text, Box } from 'app/components/base';
import SwitchButton from 'app/components/base/SwitchButton';
import ErrorMessage from 'app/components/form/ErrorMessage';
import { UserType } from 'types/resources/user';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Analytics from 'app/services/analytics';

const VacationSetting = ({ user }: { user: UserType }) => {
  const fetchUser = useStoreActions((a) => a.user.fetch);
  const [vacationToggleError, setVacationToggleError] = useState('');

  const toggleVacationMode = () => {
    setVacationToggleError('');
    API.put<undefined>('me/vacation-toggle')
      .then(() => {
        fetchUser();
        Analytics.profileUpdate('vacation-mode');
      })
      .catch(setVacationToggleError);
  };

  const isUserInVacation = user.status === 'vacation';

  const showVacationConfirmDialog = () =>
    Alert.alert(
      isUserInVacation ? i18n._(t`Disable Vacation Mode`) : i18n._(t`Enable Vacation Mode`),
      isUserInVacation
        ? i18n._(
            t`When Vacation Mode is disabled, we will reactivate all of your Offers and Lists, which were active prior to going on vacation.`
          )
        : i18n._(
            t`When Vacation Mode is enabled, we will temporarily disable all of your active Offers and Lists. You will be unable to edit or make a new Offer or List while on vacation, but you can delete them if necessary.`
          ),
      [
        {
          text: i18n._(t`Dismiss`),
          style: 'cancel',
        },
        {
          text: isUserInVacation ? i18n._(t`Turn Off`) : i18n._(t`Turn On`),
          onPress: toggleVacationMode,
        },
      ],
      { cancelable: true }
    );

  return (
    <>
      <Box
        width="100%"
        mt={5}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text mr={4} fontSize={3} fontFamily="bold">
          <Trans>VACATION MODE</Trans>
        </Text>
        <SwitchButton value={user.status === 'vacation'} onChecked={showVacationConfirmDialog} />
      </Box>
      <ErrorMessage>{vacationToggleError}</ErrorMessage>
      <Text fontSize={1} mt={3} mb={6} color="textSecondary">
        <Trans>
          Temporarily take a break from selling by putting your offer and list on hold until you are
          ready to sell again
        </Trans>
      </Text>
    </>
  );
};
export default VacationSetting;
