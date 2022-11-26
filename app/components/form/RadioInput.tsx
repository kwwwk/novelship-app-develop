import React, { createContext, useContext } from 'react';

import { ButtonBase, Box } from 'app/components/base';
import { BoxProps } from 'app/components/base/Box';

type RadioButtonContextType<T> = {
  value: T;
  setValue(arg: T): void;
};

const defaultRadioContext: RadioButtonContextType<string> = {
  value: '',
  setValue: () => {},
};

const RadioButtonContext = createContext<RadioButtonContextType<unknown>>(defaultRadioContext);

function RadioGroup<T>({ value, setValue, children }: RadioButtonContextType<T> & BoxProps) {
  return (
    <RadioButtonContext.Provider value={{ value, setValue }}>
      {children}
    </RadioButtonContext.Provider>
  );
}

const RadioButton = ({
  value,
  children,
  disabled,
  ...props
}: {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
} & BoxProps) => {
  const { value: currentValue, setValue } = useContext(RadioButtonContext);

  return (
    <ButtonBase onPress={() => setValue(value)} disabled={disabled}>
      <Box alignItems="center" flexDirection="row" {...props}>
        <Box
          center
          mr={3}
          width={20}
          height={20}
          borderWidth={1}
          borderRadius={10}
          borderColor={disabled ? 'gray5' : 'textBlack'}
        >
          {value === currentValue && (
            <Box width={12} height={12} bg="textBlack" borderRadius={10} />
          )}
        </Box>
        {children}
      </Box>
    </ButtonBase>
  );
};

// to be always used in conjunction
export default { Group: RadioGroup, Button: RadioButton };
