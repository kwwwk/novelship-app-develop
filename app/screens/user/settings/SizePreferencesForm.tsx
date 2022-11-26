import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useStoreState, useStoreActions } from 'app/store';
import { Box, Button, Text } from 'app/components/base';
import { Field } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import {
  Footer,
  KeyboardAwareContainer,
  PageContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import { useQuery } from 'react-query';
import useForm from 'app/hooks/useForm';
import SneakersIcon from 'app/components/icons/SneakersIcon';

import { UserRoutes } from 'types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import useOnUpdatedOnly from 'app/hooks/useOnUpdatedOnly';
import ApparelIcon from 'app/components/icons/ApparelIcon';
import {
  brandMap,
  brandOptions,
  BrandSizesType,
  categoryOptions,
  ShoeSizesType,
  sizeUnitOptions,
  tee_sizes,
} from 'common/constants/size';

const SizePreferencesSchema = Yup.object().shape({
  shoe_size: Yup.string().required(i18n._(t`Shoe size is required`)),
  shoe_unit: Yup.string().required(i18n._(t`Shoe unit is required`)),
  shoe_category: Yup.string().required(i18n._(t`Shoe category is required`)),
});

const SizePreferencesForm = ({
  navigation,
}: StackScreenProps<UserRoutes, 'SizePreferencesForm'>) => {
  const user = useStoreState((s) => s.user.user);
  const updateUser = useStoreActions((a) => a.user.update);
  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>();
  const [shoeSizes, setShoeSizes] = useState<ShoeSizesType[]>([]);

  const { data: sneakerSizes = {} } = useQuery<Record<string, BrandSizesType[]>>(`sneaker-sizes`, {
    initialData: {},
  });

  const isSneaker = !!user?.size_preferences?.Sneakers || false;
  const isApparel = !!user?.size_preferences?.Apparel || false;

  const initialValues = {
    shoe_size: isSneaker ? user.size_preferences.Sneakers?.size : '',
    shoe_unit: isSneaker ? user.size_preferences.Sneakers?.unit : 'US',
    shoe_brand: isSneaker ? user.size_preferences.Sneakers?.brand : '',
    shoe_category: isSneaker ? user.size_preferences.Sneakers?.category || 'men' : 'men',
    tee_size: isApparel ? user.size_preferences.Apparel?.size : '',
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
        navigation.goBack();
      })
      .catch(setFormError)
      .finally(() => setLoading(false));
  };

  const form = useForm({ initialValues, submit, validationSchema: SizePreferencesSchema });

  const _shoeGender = form.getInputFields('shoe_category').value;
  const _shoeBrand = form.getInputFields('shoe_brand').value;
  const _shoeUnit = form.getInputFields('shoe_unit').value;

  useOnUpdatedOnly(() => {
    form.setFieldValue('shoe_size', '');
  }, [_shoeGender, _shoeBrand, _shoeUnit]);

  useEffect(() => {
    const shoeBrand = brandMap[_shoeBrand || ''] || _shoeBrand;
    const sizeMap = Object.entries(sneakerSizes).reduce((prev: ShoeSizesType[], curr) => {
      const [brandName, brandSizes]: [string, BrandSizesType[]] = curr;

      if (brandName === shoeBrand || !shoeBrand) {
        // $FlowFixMe
        brandSizes.forEach((brandSize: BrandSizesType) => {
          if (brandSize.gender === _shoeGender || !_shoeGender) {
            const sizeMapEntry: ShoeSizesType = {
              size: brandSize[_shoeUnit || 'US'],
              eu_size: brandSize.EU_R || brandSize.EU,
              us_size: brandSize.US,
            };
            if (prev.findIndex((s) => s.size === sizeMapEntry.size) === -1) {
              prev.push(sizeMapEntry);
            }
          }
        });
      }

      return prev;
    }, []);

    setShoeSizes(sizeMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_shoeGender, _shoeBrand, _shoeUnit, sneakerSizes]);

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <PageContainer mt={5} mb={10}>
            <Text fontSize={4} fontFamily="bold">
              <Trans>MY SIZE</Trans>
            </Text>
            <Box my={4} />
            <Box width="40%" style={{ marginRight: '3%' }} mb={5}>
              <Text color="gray3" fontSize={2} fontFamily="medium" mb={3}>
                <Trans>SNEAKERS</Trans>
              </Text>
              <SneakersIcon />
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
                    label: i18n._(category) || '',
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
                  <Trans>Favorite Brand:</Trans>
                </Text>
              </Box>
              <Box width="60%">
                <Field
                  type="select"
                  label=""
                  placeholder={i18n._(t`Select Brand`)}
                  {...form.getInputFields('shoe_brand')}
                  items={brandOptions.map((item: string) => ({
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
            <Box my={4} backgroundColor="dividerGray" height={1} />
            <Box width="40%" style={{ marginRight: '3%' }} mb={5}>
              <Text color="gray3" fontSize={2} fontFamily="medium" mb={3}>
                <Trans>APPAREL</Trans>
              </Text>

              <ApparelIcon />
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
          </PageContainer>
        </ScrollContainer>

        <Footer>
          <>
            <ErrorMessage mb={4}>{formError}</ErrorMessage>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Button
                variant="white"
                size="lg"
                width="49%"
                text={i18n._(t`CANCEL`)}
                onPress={() => navigation.goBack()}
              />
              <Button
                text={i18n._(t`SAVE`)}
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
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

export default SizePreferencesForm;
