import React, { useState } from 'react';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { RootRoutes } from 'types/navigation';
import { Box, Text, Button, ButtonBase } from 'app/components/base';
import { cacheRemove, cacheSet } from 'app/services/asyncStorage';
import ErrorMessage from 'app/components/form/ErrorMessage';
import { Field } from 'app/components/form';
import { useStoreState } from 'app/store';
import useForm from 'app/hooks/useForm';

import API from 'common/api';
import { Header, PageContainer } from 'app/components/layout';
import theme from 'app/styles/theme';
import { navigateBackOrGoToHome } from 'app/services/navigation';
import useCacheGetRef from 'app/hooks/useCacheGetRef';

type PartnerSalesNavigationProp = StackNavigationProp<RootRoutes, 'PartnerSales'>;

const PartnerSalesForm = ({ navigation }: { navigation: PartnerSalesNavigationProp }) => {
  const countryId = useStoreState((s) => s.country.current.id);
  const userId = useStoreState((s) => s.user.user.id);

  const checkExistingPartnerCode = (code: string) => {
    if (code || userId) {
      API.fetch<{ code?: string }>(
        !userId && code ? `partner_promotion/${code}` : 'me/partner_promotion',
        { filter: { country_id: countryId } }
      ).then((res) => res.code && openCollection(res.code));
    }
  };

  const partner_code = useCacheGetRef<string>('partner_code', checkExistingPartnerCode);
  const initialValues = { partner_code: partner_code || '' };

  const [formError, setFormError] = useState('');

  const openCollection = (code: string) => {
    if (userId) {
      cacheRemove('partner_code');
    } else {
      cacheSet('partner_code', code);
    }
    navigation.replace('NotFoundScreen', { uri: `/partner-sales/${code}` });
  };

  const submit = (values: typeof initialValues) => {
    API.post(userId ? 'me/partner_promotion/validate' : 'partner_promotion/validate', {
      code: values.partner_code,
      country_id: countryId,
    })
      .then(() => openCollection(values.partner_code))
      .catch((e) => setFormError(e));
  };

  const form = useForm({ initialValues, submit });

  return (
    <>
      <Header>
        <Box flexDirection="row" justifyContent="space-between" width="100%">
          <Box width={theme.constants.HEADER_ICON_SIZE}>
            <ButtonBase
              onPress={() => navigateBackOrGoToHome(navigation)}
              android_ripple={{ color: theme.colors.white, borderless: true }}
            >
              <Ionicon
                name="ios-arrow-back"
                size={theme.constants.HEADER_ICON_SIZE}
                color={theme.colors.white}
              />
            </ButtonBase>
          </Box>

          <Box center>
            <Text
              color="white"
              fontFamily="bold"
              textTransform="uppercase"
              letterSpacing={theme.constants.LETTER_SPACINGS_TEXT_TITLE}
              fontSize={3}
            >
              <Trans>PRIVATE PARTNERSHIP</Trans>
            </Text>
          </Box>
          <ButtonBase
            onPress={() => navigateBackOrGoToHome(navigation)}
            android_ripple={{ color: theme.colors.white, borderless: true }}
          >
            <Ionicon name="ios-close" size={theme.constants.HEADER_ICON_SIZE} color="transparent" />
          </ButtonBase>
        </Box>
      </Header>
      <PageContainer>
        <Box px={2}>
          <Text mt={7} fontSize={3} fontFamily="bold" lineHeight={16 * 1.2}>
            <Trans>NOVELSHIP PRIVATE PARTNERSHIP PROGRAM</Trans>
          </Text>
          <Text mt={4} fontSize={2}>
            <Trans>Please enter your partner code to access the page.</Trans>
          </Text>
          <Box my={3}>
            <Field
              {...form.getInputFields('partner_code')}
              placeholder={i18n._(t`Enter your Partner Code Here`)}
              onSubmitEditing={form.submitForm}
            />
            <ErrorMessage mt={3}>{i18n._(formError)}</ErrorMessage>
          </Box>
          <Button text={i18n._(t`SUBMIT`)} onPress={form.submitForm} variant="black" />
        </Box>
      </PageContainer>
    </>
  );
};

export default PartnerSalesForm;
