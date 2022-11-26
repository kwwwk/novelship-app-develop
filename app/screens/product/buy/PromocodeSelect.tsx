import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';

import { LB } from 'common/constants';
import theme from 'app/styles/theme';
import { useStoreState } from 'app/store';
import { ProductRoutes } from 'types/navigation';
import { paymentMethodString } from 'common/utils/payment';
import { Input, Radio } from 'app/components/form';
import { expireIn, toDate } from 'common/utils/time';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import ErrorMessage from 'app/components/form/ErrorMessage';
import { defaultPromocode } from 'types/resources/promocode';
import { Box, Button, ButtonBase, Text } from 'app/components/base';
import {
  Footer,
  KeyboardAwareContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import Analytics from 'app/services/analytics';
import ProductCheckoutContext from '../context';

type PromocodeNavigationProps = StackNavigationProp<ProductRoutes, 'PromocodeSelect'>;
type ActionType = 'select' | 'text-input' | '';

const PromocodeSelect = () => {
  const navigation = useNavigation<PromocodeNavigationProps>();
  const { $ } = useCurrencyUtils();

  const user = useStoreState((s) => s.user.user);
  const {
    buy: {
      buy,
      promocode: {
        applicablePromocodes,
        currentPromocode,
        fetchApplicablePromocodes,
        setApplicablePromocodes,
        setCurrentPromocode,
        verifyPromocode,
      },
      paymentMethod,
    },
    product,
  } = useContext(ProductCheckoutContext);

  const [promoInputValue, setPromoInputValue] = useState<string>('');
  const [promocodeSelected, setPromocodeSelected] = useState<string>(currentPromocode.code);
  const [promoError, setPromoError] = useState<string>('');
  const [action, setAction] = useState<ActionType>('');

  const applyPromocode = async (_action: ActionType) => {
    setPromoError('');
    const code = _action === 'select' ? promocodeSelected : promoInputValue;

    if (code === '_clear') {
      setCurrentPromocode(defaultPromocode);
      return navigation.goBack();
    }

    if (!user.hasDelivery) {
      return setPromoError(i18n._(t`Please Add Delivery address to apply promocode`));
    }

    setAction(_action);

    verifyPromocode(code)
      .then((promocode) => {
        Analytics.promocodeApply(product, buy, promocode);
        navigation.goBack();
      })
      .catch((err: string) => {
        if (_action === 'select') {
          setApplicablePromocodes([]);
          fetchApplicablePromocodes();
          setCurrentPromocode(defaultPromocode);
          navigation.goBack();
          Toast.show({
            type: 'default',
            text1: `${i18n._(err)}, ${i18n._(t`Please reselect promocode.`)}`,
            position: 'bottom',
            bottomOffset: 120,
          });
        } else {
          setPromoError(i18n._(err));
        }
      })
      .finally(() => setAction(''));
  };

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <Box borderBottomColor="dividerGray" borderBottomWidth={1} px={5} pb={5}>
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" my={6}>
            <Box width={theme.constants.HEADER_ICON_SIZE} />
            <Text fontFamily="bold" fontSize={3}>
              <Trans>APPLY PROMOCODE</Trans>
            </Text>
            <Box>
              <ButtonBase
                onPress={() => navigation.goBack()}
                android_ripple={{ color: theme.colors.white, borderless: true }}
              >
                <Ionicon
                  name="ios-close"
                  size={theme.constants.HEADER_ICON_SIZE}
                  color={theme.colors.textBlack}
                />
              </ButtonBase>
            </Box>
          </Box>

          <Box
            flexDirection="row"
            width="100%"
            borderColor="gray5"
            borderWidth={1}
            borderRadius={4}
          >
            <Box width="72%">
              <Input
                placeholder={i18n._(t`Enter Promocode`)}
                value={promoInputValue}
                onChangeText={(p) => {
                  setPromoError('');
                  setPromoInputValue(p);
                }}
                style={styles.inputContainer}
              />
            </Box>

            <Box style={{ marginLeft: 'auto' }}>
              <Button
                text={i18n._(t`APPLY`)}
                variant="white"
                onPress={() => applyPromocode('text-input')}
                style={styles.buttonContainer}
                loading={action === 'text-input'}
                disabled={!promoInputValue || action === 'select'}
              />
            </Box>
          </Box>

          {!!promoError && <ErrorMessage mt={2}>{i18n._(promoError)}</ErrorMessage>}
        </Box>

        {applicablePromocodes.length > 0 && (
          <ScrollContainer>
            <Radio.Group<string> value={promocodeSelected} setValue={setPromocodeSelected}>
              <Box key={0} p={3} borderBottomWidth={1} borderColor="dividerGray">
                <Radio.Button value="_clear" alignItems="center" p={4}>
                  <Box ml={3}>
                    <Text fontFamily="medium" fontSize={2}>
                      <Trans>No Promocode Applied</Trans>
                    </Text>
                  </Box>
                </Radio.Button>
              </Box>
              {applicablePromocodes.map((promo) => {
                const isPromoDisabled = !!(
                  promo.payment_method && paymentMethod !== promo.payment_method
                );
                const expiryHours = parseInt(expireIn(promo.end_date, 'hour').split(' ')[0]);
                const expiryDays = parseInt(expireIn(promo.end_date, 'day').split(' ')[0]);

                return (
                  <Box
                    px={3}
                    py={2}
                    key={promo.code}
                    borderBottomWidth={1}
                    borderBottomColor="dividerGray"
                  >
                    <Radio.Button
                      alignItems="flex-start"
                      value={promo.code}
                      px={4}
                      py={4}
                      disabled={isPromoDisabled}
                    >
                      <Box
                        ml={3}
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        flex={1}
                      >
                        <Box alignItems="flex-start">
                          <Text
                            fontFamily="medium"
                            fontSize={2}
                            color={isPromoDisabled ? 'gray5' : 'textBlack'}
                          >
                            {promo.description ? (
                              promo.description
                            ) : promo.is_percentage_discount ? (
                              <Trans>{promo.value}% Off</Trans>
                            ) : (
                              <Trans>{$(promo.value)} Discount</Trans>
                            )}
                          </Text>
                          <Box
                            borderStyle="dashed"
                            borderWidth={1}
                            borderRadius={6}
                            py={2}
                            px={4}
                            my={3}
                            backgroundColor="gray7"
                            borderColor={isPromoDisabled ? 'gray5' : 'textBlack'}
                          >
                            <Text fontSize={1} color={isPromoDisabled ? 'gray5' : 'textBlack'}>
                              {promo.code}
                            </Text>
                          </Box>
                          <Text fontSize={1} color={isPromoDisabled ? 'gray5' : 'textBlack'}>
                            {toDate(promo.end_date, 'DD/MM/YYYY')}
                            <Text fontSize={1} color={isPromoDisabled ? 'gray5' : 'red'}>
                              {expiryHours <= 24 ? (
                                <>
                                  {LB}
                                  <Trans>(Expiring soon: {expiryHours}h left)</Trans>
                                </>
                              ) : expiryDays <= 30 ? (
                                <>
                                  {LB}
                                  <Trans>(Expiring soon: {expiryDays} days left)</Trans>
                                </>
                              ) : (
                                ''
                              )}
                            </Text>
                          </Text>
                          <Text fontSize={1} mt={4} color={isPromoDisabled ? 'gray5' : 'gray3'}>
                            <Trans>
                              Applicable For{' '}
                              {paymentMethodString(promo.payment_method || '') ||
                                i18n._(promo.class || '') ||
                                i18n._(t`All Categories`)}
                            </Trans>
                          </Text>
                        </Box>
                        <Box center>
                          <Text
                            fontSize={5}
                            color={isPromoDisabled ? 'gray5' : 'green'}
                            fontFamily="bold"
                          >
                            {promo.is_percentage_discount ? (
                              <Trans>{promo.value}% Off</Trans>
                            ) : (
                              $(promo.value)
                            )}
                          </Text>
                          {promo.max_discount > 0 && (
                            <Text
                              fontSize={2}
                              color={isPromoDisabled ? 'gray5' : 'green'}
                              textAlign="center"
                            >
                              <Trans>Up to {$(promo.max_discount)}</Trans>
                            </Text>
                          )}
                          {promo.min_buy > 0 && (
                            <Text
                              fontSize={2}
                              color={isPromoDisabled ? 'gray5' : 'green'}
                              textAlign="center"
                            >
                              <Trans>
                                Min. Spend {LB} {$(promo.min_buy)}
                              </Trans>
                            </Text>
                          )}
                        </Box>
                      </Box>
                    </Radio.Button>
                  </Box>
                );
              })}
            </Radio.Group>
            <Box mt={10} />
          </ScrollContainer>
        )}

        {!applicablePromocodes.length && (
          <Box backgroundColor="gray7" flex={1} center>
            <Text color="gray3">
              <Trans>No Promocodes Available</Trans>
            </Text>
          </Box>
        )}
      </KeyboardAwareContainer>
      <Footer>
        <Button
          variant="black"
          size="lg"
          text={i18n._(t`CONFIRM`)}
          loading={action === 'select'}
          disabled={!promocodeSelected || !!action}
          onPress={() => applyPromocode('select')}
        />
      </Footer>
    </SafeAreaScreenContainer>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 48,
    borderWidth: 0,
  },
  buttonContainer: {
    height: 48,
    borderWidth: 0,
    paddingHorizontal: 16,
  },
});

export default PromocodeSelect;
