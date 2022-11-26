import { StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import * as Yup from 'yup';
import { useQuery } from 'react-query';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

import theme from 'app/styles/theme';
import { useStoreActions, useStoreState } from 'app/store';
import { Box, Button, Text } from 'app/components/base';
import { Footer, KeyboardAwareContainer, ScrollContainer } from 'app/components/layout';
import LimitedView from 'app/components/misc/LimitedView';

import useOnUpdatedOnly from 'app/hooks/useOnUpdatedOnly';
import useForm from 'app/hooks/useForm';
import {
  BrandSizesType,
  categoryOptions,
  genderMap,
  ShoeSizesType,
  sizeUnitOptions,
  tee_sizes,
} from 'common/constants/size';
import { ProductRoutes } from 'types/navigation';
import { Field } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import ProductCheckoutContext from '../../context';

const SizeChart = ({ mode }: { mode: 'product' | 'dialog' }) => {
  const isProductPage = mode === 'product';

  const navigation = useNavigation<StackNavigationProp<ProductRoutes, 'SizeChart'>>();
  const {
    product,
    size: { map: sizeMap, preferredSizeUnit },
  } = useContext(ProductCheckoutContext);
  const user = useStoreState((s) => s.user.user);
  const updateUser = useStoreActions((a) => a.user.update);
  const { data: sneakerSizes = [] } = useQuery<BrandSizesType[]>(
    `sneaker-sizes/${product.main_brand}`,
    {
      initialData: [],
      enabled: !isProductPage && !!user.id && !!product.id && product.is_sneaker,
    }
  );

  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>();
  const [shoeSizes, setShoeSizes] = useState<ShoeSizesType[]>([]);

  const isSneakerSizeSet = !!user?.size_preferences?.Sneakers;
  const isApparelSizeSet = !!user?.size_preferences?.Apparel;

  const initialValues = {
    shoe_size: isSneakerSizeSet ? user.size_preferences.Sneakers?.size : '',
    shoe_unit: isSneakerSizeSet ? user.size_preferences.Sneakers?.unit : 'US',
    shoe_brand: isSneakerSizeSet ? user.size_preferences.Sneakers?.brand : '',
    shoe_category: isSneakerSizeSet
      ? user.size_preferences.Sneakers?.category || 'men'
      : genderMap[product.gender] || product.gender,
    tee_size: isApparelSizeSet ? user.size_preferences.Apparel?.size : '',
  };

  const submit = (values: typeof initialValues) => {
    setLoading(true);

    const _sizeSelected = shoeSizes.find((s) => s.size.toString() === values.shoe_size);
    const { eu_size, us_size } = _sizeSelected || {};

    const size_preferences = {
      Sneakers: {
        size: values.shoe_size,
        unit: values.shoe_unit,
        category: values.shoe_category,
        brand: values.shoe_brand || '',
        eu_size: `${eu_size}`,
        us_size: `${us_size}`,
      },
      Apparel: {
        size: values.tee_size || '',
      },
    };

    // @ts-ignore ignore
    updateUser({ size_preferences })
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch(setFormError)
      .finally(() => setLoading(false));
  };

  const SizePreferencesSchema = Yup.object().shape({
    shoe_size: Yup.string().required(i18n._(t`Shoe size is required`)),
    shoe_unit: Yup.string().required(i18n._(t`Shoe unit is required`)),
    shoe_category: Yup.string().required(i18n._(t`Shoe category is required`)),
  });

  const TeeSizePreferencesSchema = Yup.object().shape({
    tee_size: Yup.string().required(i18n._(t`Tee size is required`)),
  });

  const form = useForm({
    initialValues,
    submit,
    validationSchema: product.is_sneaker ? SizePreferencesSchema : TeeSizePreferencesSchema,
  });

  const _shoeGender = form.getInputFields('shoe_category').value;
  const _shoeUnit = form.getInputFields('shoe_unit').value;
  const _shoeSize = form.getInputFields('shoe_size').value;

  const preferredGender = user.size_preferences.Sneakers?.category || '';
  const SHOW_US_M_OR_US_W =
    preferredSizeUnit === 'US'
      ? product.gender === 'men' && preferredGender === 'women'
        ? 'US_W'
        : product.gender === 'women' && preferredGender === 'men'
        ? 'US_M'
        : ''
      : '';

  useOnUpdatedOnly(() => {
    form.setFieldValue('shoe_size', '');
  }, [_shoeGender, _shoeUnit]);

  useEffect(() => {
    const _sizeMap = sneakerSizes.reduce((prev: ShoeSizesType[], curr) => {
      if (curr.gender === _shoeGender || !_shoeGender) {
        const sizeMapEntry = {
          size: curr[_shoeUnit || 'US'],
          eu_size: curr.EU_R || curr.EU,
          us_size: curr.US,
        };
        if (prev.findIndex((s) => s.size === sizeMapEntry.size) === -1) {
          prev.push(sizeMapEntry);
        }
      }
      return prev;
    }, []);

    setShoeSizes(_sizeMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_shoeGender, _shoeUnit, sneakerSizes]);

  const sizes = Object.values(sizeMap);
  const sizeNames = ['US', 'UK', 'EU', 'JP'];
  if (SHOW_US_M_OR_US_W) {
    sizeNames.push(SHOW_US_M_OR_US_W.replace('_', ' '));
  }
  const COLUMN_WIDTH = 100 / sizeNames.length;

  const showSizeChart = product.is_sneaker && sizes.length > 0;
  const showSizePreferenceForm = !isProductPage && !!user.id;

  return (
    <>
      <KeyboardAwareContainer>
        <ScrollContainer
          scrollEnabled={!isProductPage}
          stickyHeaderIndices={[showSizePreferenceForm ? 1 : 0]}
        >
          {/* -- Size Preferences Form -- */}
          {showSizePreferenceForm &&
            (product.is_sneaker ? (
              <Box px={5} mt={7}>
                <Box
                  width="100%"
                  alignItems="center"
                  style={{ flexDirection: 'row' }}
                  justifyContent="space-between"
                  mb={4}
                >
                  <Box width="40%">
                    <Text fontFamily="medium" fontSize={3}>
                      <Trans>Size:</Trans>
                    </Text>
                  </Box>
                  <Box width="60%">
                    <Text fontFamily="bold" fontSize={3}>{`${_shoeUnit} ${_shoeSize}${
                      _shoeGender === 'men' && _shoeUnit === 'US' ? 'M' : ''
                    }`}</Text>
                  </Box>
                </Box>
                <Box
                  width="100%"
                  alignItems="center"
                  style={{ flexDirection: 'row' }}
                  justifyContent="space-between"
                  mb={4}
                >
                  <Box width="40%">
                    <Text fontFamily="medium" fontSize={3}>
                      <Trans>Category:</Trans>
                    </Text>
                  </Box>
                  <Box width="60%">
                    <Field
                      type="select"
                      label=""
                      placeholder={i18n._(t`Select Category`)}
                      {...form.getInputFields('shoe_category')}
                      items={categoryOptions.map((category: string) => ({
                        label: category || '',
                        value: `${category.toLowerCase()}` || '',
                      }))}
                    />
                  </Box>
                </Box>
                <Box
                  width="100%"
                  alignItems="center"
                  style={{ flexDirection: 'row' }}
                  justifyContent="space-between"
                  mb={4}
                >
                  <Box width="40%">
                    <Text fontFamily="medium" fontSize={3}>
                      <Trans>Size Unit:</Trans>
                    </Text>
                  </Box>
                  <Box width="60%">
                    <Field
                      type="select"
                      label=""
                      placeholder={i18n._(t`Select Size Unit`)}
                      {...form.getInputFields('shoe_unit')}
                      items={sizeUnitOptions.map((item: string) => ({
                        label: item || '',
                        value: item || '',
                      }))}
                    />
                  </Box>
                </Box>
                <Box
                  width="100%"
                  alignItems="center"
                  style={{ flexDirection: 'row' }}
                  justifyContent="space-between"
                  mb={4}
                >
                  <Box width="40%">
                    <Text fontFamily="medium" fontSize={3}>
                      <Trans>Shoe Size:</Trans>
                    </Text>
                  </Box>
                  <Box width="60%">
                    <Field
                      type="select"
                      label=""
                      placeholder={i18n._(t`Shoe Size`)}
                      {...form.getInputFields('shoe_size')}
                      items={shoeSizes.map(({ size }) => ({
                        label:
                          `${_shoeUnit || 'US'} ${size}${
                            _shoeUnit === 'US' && _shoeGender === 'men' ? 'M' : ''
                          }` || '',
                        value: `${size}` || '',
                      }))}
                    />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box
                mt={7}
                px={5}
                width="100%"
                alignItems="center"
                style={{ flexDirection: 'row' }}
                justifyContent="space-between"
                mb={4}
              >
                <Box width="40%">
                  <Text fontFamily="medium" fontSize={3}>
                    <Trans>Tee Size:</Trans>
                  </Text>
                </Box>
                <Box width="60%">
                  <Field
                    type="select"
                    label=""
                    placeholder={i18n._(t`Select Tee Size`)}
                    {...form.getInputFields('tee_size')}
                    items={tee_sizes.map((item: string) => ({
                      label: item || '',
                      value: `${item}` || '',
                    }))}
                  />
                </Box>
              </Box>
            ))}

          {/* -- size chart -- */}
          {showSizeChart && (
            <Box flexDirection="row" justifyContent="space-between" width="100%">
              {sizeNames.map((title, i) => (
                <Box key={i} width={`${COLUMN_WIDTH}%`} style={styles.table_header} py={3}>
                  <Text textAlign="center" fontFamily="medium">
                    {title}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
          {showSizeChart && (
            <LimitedView.Container limit={10} showAll={!isProductPage}>
              <LimitedView.Content>
                {sizes.map((size, i) => (
                  <React.Fragment key={i}>
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      width="100%"
                      bg={i % 2 === 0 ? 'white' : 'gray8'}
                      py={4}
                    >
                      <Box width={`${COLUMN_WIDTH}%`}>
                        <Text textAlign="center">
                          {size.US || '-'}
                          {product.gender === 'men' && 'M'}
                        </Text>
                      </Box>
                      <Box width={`${COLUMN_WIDTH}%`}>
                        <Text textAlign="center">{size.UK || '-'}</Text>
                      </Box>
                      <Box width={`${COLUMN_WIDTH}%`}>
                        <Text textAlign="center">{size.EU || '-'}</Text>
                      </Box>
                      <Box width={`${COLUMN_WIDTH}%`}>
                        <Text textAlign="center">{size.JP || '-'}</Text>
                      </Box>
                      {!!SHOW_US_M_OR_US_W && (
                        <Box width={`${COLUMN_WIDTH}%`}>
                          <Text textAlign="center">{size[SHOW_US_M_OR_US_W] || '-'}</Text>
                        </Box>
                      )}
                    </Box>
                  </React.Fragment>
                ))}
              </LimitedView.Content>

              <Box center mx={5} mt={3}>
                <LimitedView.ShowMore>
                  <Button
                    variant="white"
                    width="100%"
                    size="sm"
                    text={i18n._(t`SHOW MORE`)}
                    onPress={() => {}}
                  />
                </LimitedView.ShowMore>
                <LimitedView.ShowLess>
                  <Button
                    variant="white"
                    width="100%"
                    size="sm"
                    text={i18n._(t`SHOW LESS`)}
                    onPress={() => {}}
                  />
                </LimitedView.ShowLess>
              </Box>
            </LimitedView.Container>
          )}
        </ScrollContainer>
      </KeyboardAwareContainer>
      {showSizePreferenceForm && (
        <Footer>
          <>
            <ErrorMessage>{formError}</ErrorMessage>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Button
                variant="white"
                size="lg"
                width="49%"
                text={i18n._(t`CANCEL`)}
                onPress={() => navigation.goBack()}
              />
              <Button
                text={i18n._(t`CONFIRM`)}
                variant="black"
                size="lg"
                width="49%"
                onPress={form.submitForm}
                loading={loading}
                disabled={loading}
              />
            </Box>
          </>
        </Footer>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  table_header: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.gray7,
    paddingVertical: 15,
    backgroundColor: theme.colors.gray8,
  },
});

export default SizeChart;
