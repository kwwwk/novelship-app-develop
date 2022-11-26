import React, { useState } from 'react';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Field } from 'app/components/form';
import { IS_OS_IOS } from 'common/constants';
import { toDate } from 'common/utils/time';
import InfoDialog from 'app/components/dialog/InfoDialog';
import { ButtonBase, Box } from 'app/components/base';

const dateFormat = (date = '') => {
  if (date.includes('/')) {
    const dateStr = date.split('/');
    return `${dateStr[2]}-${dateStr[1]}-${dateStr[0]}`;
  }
  return date;
};

type DateInputProps = {
  value: string;
  onChangeText: (arg0: string) => void;
  label: string;
};

const DateInput: React.FunctionComponent<DateInputProps> = ({ value, onChangeText, label }) => {
  const [show, setShow] = useState(false);
  const date = value ? new Date(dateFormat(String(value))) : new Date();

  const onDateSelect = (_: unknown, selectedDate?: Date) => {
    setShow(IS_OS_IOS); // on ios selecting date shouldn't close, close on InfoDialog close
    const newDate = selectedDate || date;
    const formattedDate = toDate(newDate, 'YYYY-MM-DD'); // db stores in this format
    onChangeText(formattedDate);
  };

  return (
    <>
      <ButtonBase onPress={() => setShow(true)}>
        <Field
          value={value ? toDate(date, 'DD/MM/YYYY') : ''}
          name="date"
          label={label}
          editable={false}
          onPressOut={() => setShow(true)}
        />
      </ButtonBase>
      {show &&
        (IS_OS_IOS ? (
          <InfoDialog isOpen buttonText={i18n._(t`OK`)} onClose={() => setShow(false)}>
            <Box width="100%">
              <DateTimePicker value={date} mode="date" display="inline" onChange={onDateSelect} />
            </Box>
          </InfoDialog>
        ) : (
          <DateTimePicker value={date} mode="date" display="calendar" onChange={onDateSelect} />
        ))}
    </>
  );
};

export default DateInput;
