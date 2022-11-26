import React, { useState } from 'react';
import { Box, ImgixImage, Text, ButtonBase } from 'app/components/base';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import theme from 'app/styles/theme';
import Ionicon from 'react-native-vector-icons/Ionicons';

const steps = [
  {
    title: i18n._(t`GET`),
    text: i18n._(t`Sign up & spin the wheel to find your next travel destination.`),
    img: 'events/2022/travelWithNS/step1.png',
  },
  {
    title: i18n._(t`SET`),
    text: i18n._(
      t`Spin the wheel up to 3 times each day. Check back in the next day & your spin counter will be re-set.`
    ),
    img: 'events/2022/travelWithNS/step2.png',
  },
  {
    title: i18n._(t`GO!`),
    text: i18n._(t`Shop Novelship's City Edit with your unique promocodes.`),
    img: 'events/2022/travelWithNS/step3.png',
  },
];

const TravelWithNSHowToPlay = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const onChangeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'));
    setIsExpanded((_isExpanded) => !_isExpanded);
  };

  return (
    <Box center mx={5} mt={7}>
      <Box
        center
        justifyContent="space-between"
        style={{
          backgroundColor: theme.colors.gray7,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
        py={2}
        px={4}
      >
        <ButtonBase
          onPress={onChangeLayout}
          android_ripple={{ color: theme.colors.rippleGray, borderless: true }}
        >
          <Box center flexDirection="row" height={34}>
            <Text fontFamily="regular" fontSize={3} letterSpacing={1}>
              <Trans>HOW TO </Trans>{' '}
            </Text>
            <Text fontFamily="bold" fontSize={3} letterSpacing={1}>
              <Trans>PLAY</Trans>
            </Text>
            <Ionicon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              style={{ marginTop: 2 }}
            />
          </Box>
        </ButtonBase>
      </Box>

      {isExpanded &&
        steps.map((step, i) => (
          <Box
            key={i}
            mx={6}
            mt={7}
            width="100%"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
            minHeight={76}
          >
            <Box width="20%">
              <ImgixImage src={step.img} width={64} height={64} />
            </Box>
            <Box width="75%" justifyContent="center">
              <Text fontSize={4} fontFamily="bold">
                {step.title}
              </Text>
              <Text fontSize={2} mt={1} lineHeight={18}>
                {step.text}
              </Text>
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default TravelWithNSHowToPlay;
