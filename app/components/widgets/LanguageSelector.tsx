import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

import theme from 'app/styles/theme';
import { Box } from 'app/components/base';
import { Select } from 'app/components/form';
import { LANGUAGES, LanguageType } from 'app/services/language';
import { BoxProps } from 'app/components/base/Box';
import { useStoreActions, useStoreState } from 'app/store';

const LanguageSelector = ({ variant, ...props }: { variant: 'white' | 'textBlack' } & BoxProps) => {
  const currentLanguage = useStoreState((s) => s.language.current);
  const userId = useStoreState((s) => s.user.user.id);

  const updateUser = useStoreActions((a) => a.user.update);
  const loadLanguage = useStoreActions((a) => a.language.load);

  const changeLocale = (l: LanguageType) =>
    userId ? updateUser({ locale: l }).then(() => loadLanguage(l)) : loadLanguage(l);

  return (
    <Box center flexDirection="row" {...props}>
      <Ionicon name="language" size={20} color={variant === 'textBlack' ? 'black' : 'white'} />
      <Select
        // @ts-ignore will be always LanguageType
        onChangeText={(l) => changeLocale(l)}
        items={Object.entries(LANGUAGES).map((l) => ({
          label: l[1].name.toUpperCase(),
          value: l[0],
        }))}
        iconColor={theme.colors[variant]}
        value={currentLanguage}
        selectStyles={{
          fontFamily: theme.fonts.medium,
          paddingLeft: 4,
          paddingRight: 24,
          fontSize: 14,
          color: theme.colors[variant],
        }}
        iconStyles={{ top: -3, right: 0, backgroundColor: 'transparent' }}
        style={{ flex: 0, height: 50, borderColor: 'transparent' }}
      />
    </Box>
  );
};

export default LanguageSelector;
