import * as React from 'react';
import { TextInputProps, StyleSheet } from 'react-native';
import { Item as PickerItem } from 'react-native-picker-select';

import { Box, Text } from 'app/components/base';
import theme from 'app/styles/theme';

import { fieldToTitle } from 'common/utils/string';
import SwitchButton from 'app/components/base/SwitchButton';
import { i18n } from '@lingui/core';
import CheckBox from './CheckBox';
import Select from './SelectInput';
import Input from './TextInput';
import ErrorMessage from './ErrorMessage';
import DateInput from './DateInput';

interface FieldProps extends TextInputProps {
  name: string;
  value?: any;
  type?: 'text' | 'password' | 'select' | 'checkbox' | 'switch' | 'date';
  label?: string;
  error?: string;
  touched?: boolean;
  hasError?: boolean;
  items?: PickerItem[];
  mask?: string;
  iconButton?: React.ReactNode;
}

const Field: React.FunctionComponent<FieldProps> = ({
  name,
  items,
  error,
  touched,
  hasError,
  iconButton,
  type = 'text',
  ...props
}) => {
  const { label, value, placeholder } = props;
  const labelText = label === '' ? label : label || fieldToTitle(name).trim();
  const placeholderText = placeholder || labelText;

  return (
    <>
      {type === 'select' ? (
        <Select
          {...props}
          hasError={hasError}
          items={items || []}
          placeholder={i18n._(placeholderText)}
        />
      ) : type === 'checkbox' ? (
        // @ts-ignore onChange prop override
        <CheckBox {...props} hasError={hasError} />
      ) : type === 'switch' ? (
        // @ts-ignore onChange prop override
        <SwitchButton {...props} />
      ) : type === 'date' ? (
        // @ts-ignore onChange prop override
        <DateInput {...props} />
      ) : (
        <>
          <Input
            {...props}
            type={type}
            hasError={hasError}
            placeholder={i18n._(placeholderText)}
            iconButton={iconButton}
            style={[props.style, props.multiline ? { paddingTop: 16, paddingBottom: 24 } : {}]}
          />
          {props.maxLength && props.multiline && (
            <Text
              color={value.length >= props.maxLength ? 'red' : 'gray3'}
              style={{ top: -24, right: 12 }}
              textAlign="right"
              fontSize={1}
            >
              {value.length}/{props.maxLength}
            </Text>
          )}
        </>
      )}
      {['text', 'password', 'select'].includes(type) && labelText ? (
        <Box
          style={{
            opacity: String(value).length > 0 ? 1 : 0,
            position: 'absolute',
            top: -10,
            left: 8,
            backgroundColor: 'white',
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={[{ lineHeight: 20 }, hasError && styles.labelError]}
            fontFamily="bold"
            color="textSecondary"
            textTransform="uppercase"
            numberOfLines={1}
            fontSize={1}
          >
            {i18n._(labelText)}
          </Text>
        </Box>
      ) : null}
      {hasError && error !== ' ' ? <ErrorMessage mt={2}>{i18n._(error || '')}</ErrorMessage> : null}
    </>
  );
};

const styles = StyleSheet.create({
  labelError: {
    color: theme.colors.textError,
  },
});

export default Field;
