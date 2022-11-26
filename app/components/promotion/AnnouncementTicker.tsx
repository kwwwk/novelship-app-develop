import React, { useEffect, useState } from 'react';
import { Box, Text, ButtonBase } from 'app/components/base';
import theme from 'app/styles/theme';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Linking } from 'react-native';
import { cacheSet, cacheGet } from 'app/services/asyncStorage';
import { useStoreState } from 'app/store';

const AnnouncementTicker = () => {
  const countryTicker = useStoreState((s) => s.country.current.site_ticker);
  // const countryTicker = {
  //   text: 'We Accept Crypto Payments Now! BTC, ETH & Tether',
  //   link: 'https://novelship.com/link',
  // };

  const [savedMsg, setMsg] = useState<string | undefined>('');

  useEffect(() => {
    cacheGet<string>('last_ticker_text').then(setMsg);
  }, []);

  const show = countryTicker.text && countryTicker.link && savedMsg !== countryTicker.text;

  if (!show) return null;

  return (
    <Box bg="blue" flexDirection="row" alignItems="center" justifyContent="space-between">
      <ButtonBase
        style={{ flex: 0.92 }}
        onPress={() =>
          countryTicker.link && countryTicker.link !== '#'
            ? Linking.openURL(countryTicker.link)
            : null
        }
      >
        <Text pl={5} py={3} color="white" fontFamily="medium" fontSize={1} lineHeight={14}>
          {countryTicker.text}
        </Text>
      </ButtonBase>
      <ButtonBase
        style={{ flex: 0.08 }}
        onPress={() => cacheSet('last_ticker_text', countryTicker.text).then(setMsg)}
        android_ripple={{ color: theme.colors.white, borderless: true }}
      >
        <Ionicon name="ios-close" size={22} color={theme.colors.white} />
      </ButtonBase>
    </Box>
  );
};

export default AnnouncementTicker;
