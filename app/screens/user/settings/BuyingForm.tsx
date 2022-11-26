import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useStoreState, useStoreActions } from 'app/store';
import { Box, Button, Text } from 'app/components/base';
import { Field, PaymentCardInput } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import {
  Footer,
  KeyboardAwareContainer,
  PageContainer,
  ScrollContainer,
  SafeAreaScreenContainer,
} from 'app/components/layout';
import useForm from 'app/hooks/useForm';
import useOnUpdatedOnly from 'app/hooks/useOnUpdatedOnly';
import { cacheGet, cacheSet } from 'app/services/asyncStorage';
import CheckBoxInput from 'app/components/form/CheckBox';
import CVCRecheck from 'app/components/form/CVCRecheck';
import { validName } from 'common/constants/validations';
import { UserRoutes } from 'types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { Keyboard } from 'react-native';
import { mapSecondAddress, userAddressMap } from 'common/utils/user';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import API from 'common/api';
import Analytics from 'app/services/analytics';

const BuyingForm = ({ navigation }: StackScreenProps<UserRoutes, 'BuyingForm'>) => {
  const user = useStoreState((s) => s.user.user);
  const countries = useStoreState((s) => s.country.countries);
  const countryGetById = useStoreState((s) => s.country.getById);
  const updateUser = useStoreActions((a) => a.user.update);

  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSameAddress, setIsSameAddress] = useState<boolean>(true);
  const [isAddressAutoFilling, setIsAddressAutoFilling] = React.useState<
    false | 'billing' | 'delivery'
  >(false);

  const isBillingAddressAutoFilling = isAddressAutoFilling === 'billing';
  const isDeliveryAddressAutoFilling = isAddressAutoFilling === 'delivery';

  const countriesSelection = [...countries];
  // @ts-ignore ignore
  countriesSelection.splice(6, 0, { name: '-' });

  const { address, billing_address, billing_country_id, country_id } = user;

  const userBillingCountry = countryGetById(billing_country_id);
  const userDeliveryCountry = countryGetById(country_id);

  const initialValues = {
    // billing
    firstname: billing_address.firstname || user.firstname || '',
    lastname: billing_address.lastname || user.lastname || '',

    line_1: billing_address.line_1,
    line_2: billing_address.line_2,
    line_3: billing_address.line_3,
    city: userBillingCountry.cities[billing_address.state]
      ? userBillingCountry.cities[billing_address.state].includes(billing_address.city)
        ? billing_address.city
        : ''
      : billing_address.city,
    state: userBillingCountry.states.length
      ? userBillingCountry.states.includes(billing_address.state)
        ? billing_address.state
        : ''
      : billing_address.state,
    zip: billing_address.zip,
    phone: billing_address.phone || user.phone,

    billing_country_id: billing_country_id || '',
    country_code: billing_address.country_code || user.country_code || '',

    // delivery
    firstname2: address.firstname || user.firstname || '',
    lastname2: address.lastname || user.lastname || '',

    line_4: address.line_1,
    line_5: address.line_2,
    line_6: address.line_3,
    city2: userDeliveryCountry.cities[address.state]
      ? userDeliveryCountry.cities[address.state].includes(address.city)
        ? address.city
        : ''
      : address.city,
    state2: userDeliveryCountry.states.length
      ? userDeliveryCountry.states.includes(address.state)
        ? address.state
        : ''
      : address.state,
    zip2: address.zip,
    phone2: address.phone || user.phone,

    country_id: country_id || '',
    country_code2: address.country_code || user.country_code || '',
  };

  const BuyingAddressSchema = Yup.object().shape({
    firstname: Yup.string()
      .required(i18n._(t`First Name is required`))
      .matches(validName, i18n._(t`Please enter valid name`))
      .max(20, i18n._(t`Maximum 20 characters allowed`)),
    lastname: Yup.string()
      .required(i18n._(t`Last Name is required`))
      .matches(validName, i18n._(t`Please enter valid name`))
      .max(20, i18n._(t`Maximum 20 characters allowed`)),
    billing_country_id: Yup.string()
      .required(i18n._(t`Country is required`))
      .test(
        'Country is required',
        'Country is required',
        (value: string | undefined) => value !== 'undefined'
      ),
    zip: Yup.string()
      .required(i18n._(t`Zip code is required`))
      .matches(/^[a-zA-Z0-9]*$/, i18n._(t`Only Alphanumeric characters allowed`)),
    state: Yup.string()
      .required(i18n._(t`State is required`))
      .max(20, i18n._(t`Maximum 20 characters allowed`))
      .nullable(),
    city: Yup.string()
      .required(i18n._(t`City is required`))
      .min(3, i18n._(t`Minimum 3 characters allowed`))
      .max(20, i18n._(t`Maximum 20 characters allowed`)),
    country_code: Yup.string().required(i18n._(t`Country code is required`)),
    phone: Yup.number()
      .typeError(i18n._(t`Invalid phone number`))
      .required(i18n._(t`Phone is required`)),
    line_1: Yup.string()
      .required(i18n._(t`Address is required`))
      .max(35, i18n._(t`Maximum 35 characters allowed`)),
    line_2: Yup.lazy(() => {
      if (isAUAddress('billing'))
        return Yup.string().max(35, i18n._(t`Maximum 35 characters allowed`));
      return Yup.string()
        .required(i18n._(t`Address is required`))
        .max(35, i18n._(t`Maximum 35 characters allowed`));
    }),
    line_3: Yup.string().max(35, i18n._(t`Maximum 35 characters allowed`)),
    ...(!isSameAddress && {
      line_4: Yup.string()
        .required(i18n._(t`Address is required`))
        .max(35, i18n._(t`Maximum 35 characters allowed`)),
      line_5: Yup.lazy(() => {
        if (isAUAddress('delivery'))
          return Yup.string().max(35, i18n._(t`Maximum 35 characters allowed`));
        return Yup.string()
          .required(i18n._(t`Address is required`))
          .max(35, i18n._(t`Maximum 35 characters allowed`));
      }),
      line_6: Yup.string().max(35, i18n._(t`Maximum 35 characters allowed`)),
      country_id: Yup.string()
        .required(i18n._(t`Country is required`))
        .test(
          'Country is required',
          'Country is required',
          (value: string | undefined) => value !== 'undefined'
        ),
      city2: Yup.string()
        .required(i18n._(t`City is required`))
        .min(3, i18n._(t`Minimum 3 characters allowed`))
        .max(20, i18n._(t`Maximum 20 characters allowed`)),
      state2: Yup.string()
        .required(i18n._(t`State is required`))
        .max(20, i18n._(t`Maximum 20 characters allowed`))
        .nullable(),
      zip2: Yup.string()
        .required(i18n._(t`Zip is required`))
        .matches(/^[a-zA-Z0-9]*$/, i18n._(t`Only Alphanumeric characters allowed`)),
      country_code2: Yup.string().required(i18n._(t`Country code is required`)),
      phone2: Yup.number()
        .typeError(i18n._(t`Invalid phone number`))
        .required(i18n._(t`Phone is required`)),
    }),
  });

  const submit = (values: any) => {
    setIsSubmitting(true);
    Keyboard.dismiss();
    const data = {
      billing_address: {
        firstname: values.firstname,
        lastname: values.lastname,
        line_1: values.line_1,
        line_2: values.line_2,
        line_3: values.line_3,
        city: values.city,
        state: values.state,
        zip: values.zip,
        phone: values.phone,
        country_code: values.country_code,
      },
      billing_country_id: parseInt(values.billing_country_id, 10),
      address: mapSecondAddress(values),
      country_id: parseInt(values.country_id, 10),
    };

    if (isSameAddress) {
      data.address = data.billing_address;
      data.country_id = data.billing_country_id;
    }
    updateUser(data)
      .then(() => {
        cacheSet('is_delivery_same', isSameAddress);
        Analytics.profileUpdate('buying');
        navigation.goBack();
      })
      .catch(setFormError)
      .finally(() => setIsSubmitting(false));
  };

  const form = useForm<typeof initialValues>({
    initialValues,
    submit,
    validationSchema: BuyingAddressSchema,
  });

  const billingCountry = countryGetById(form.getInputFields('billing_country_id').value);
  const deliveryCountry = countryGetById(form.getInputFields('country_id').value);
  function isAUAddress(addressType: 'billing' | 'delivery') {
    return addressType === 'billing'
      ? billingCountry.shortcode === 'AU'
      : addressType === 'delivery'
      ? deliveryCountry.shortcode === 'AU'
      : false;
  }
  const billingState = form.getInputFields('state').value;
  const deliveryState = form.getInputFields('state2').value;

  const autofillStateCity = (addressType: 'billing' | 'delivery') => {
    setIsAddressAutoFilling(addressType);

    const filedSuffix = addressType === 'billing' ? '' : '2';
    const zip = form.getInputFields(`zip${filedSuffix}`).value;
    const country = (addressType === 'billing' ? billingCountry : deliveryCountry).shortcode;

    API.fetch<{ state: string; city: string }>(`countries/${country}/${zip}`)
      .then((response) => {
        form.setFieldValue(
          `state${filedSuffix}`,
          response.state?.length > 20 ? '' : response.state
        );
        form.setFieldValue(`city${filedSuffix}`, response.city);
      })
      .finally(() => setIsAddressAutoFilling(false));
  };

  const toggleSameAddress = () => {
    if (!isSameAddress) {
      const fields = {
        ...userAddressMap,
        billing_country_id: 'country_id',
      } as typeof initialValues;
      Object.keys(fields).forEach((k) => {
        // @ts-ignore override
        form.setFieldValue(fields[k], form.getInputFields(k).value);
      });
    }
    setIsSameAddress(!isSameAddress);
  };

  useEffect(() => {
    cacheGet<boolean>('is_delivery_same').then((d) => {
      if (d === undefined) {
        cacheSet('is_delivery_same', true);
        setIsSameAddress(true);
      } else {
        setIsSameAddress(d);
      }
    });
  }, []);

  useOnUpdatedOnly(() => {
    form.setFieldValue('state', '');
    form.setFieldValue('city', '');
    form.setFieldValue('zip', '');
    form.setFieldValue('country_code', billingCountry.calling_code);
  }, [billingCountry.id]);

  useOnUpdatedOnly(() => {
    form.setFieldValue('state2', '');
    form.setFieldValue('city2', '');
    form.setFieldValue('zip2', '');
    form.setFieldValue('country_code2', deliveryCountry.calling_code);
  }, [deliveryCountry.id]);

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <PageContainer mt={5} mb={10}>
            <PaymentCardInput mode="buyer" title={i18n._(t`CREDIT/DEBIT CARD`)} />
            {user.buying_card_disabled && <CVCRecheck user={user} />}

            <Box my={6} height={1} bg="dividerGray" />

            <Text fontSize={3} fontFamily="bold">
              <Trans>BILLING ADDRESS</Trans>
            </Text>
            <Box my={4} />
            <Box px={1}>
              <Box>
                <Box mb={5} width="100%" style={{ flexDirection: 'row' }}>
                  <Box width="48.5%" style={{ marginRight: '3%' }}>
                    <Field {...form.getInputFields('firstname')} label="First name" />
                  </Box>
                  <Box width="48.5%">
                    <Field {...form.getInputFields('lastname')} label="Last name" />
                  </Box>
                </Box>
                <Box width="100%" mb={5}>
                  <Field
                    {...form.getInputFields('line_1')}
                    label={
                      billingCountry.shortcode === 'AU'
                        ? i18n._(t`Address`)
                        : i18n._(t`Street Address`)
                    }
                  />
                </Box>
                <Box width="100%" mb={5}>
                  <Field
                    {...form.getInputFields('line_2')}
                    label={
                      billingCountry.shortcode === 'AU'
                        ? i18n._(t`Address Line 2 (optional)`)
                        : i18n._(t`App/Suite/Unit`)
                    }
                  />
                </Box>
                <Box width="100%" mb={5}>
                  <Field {...form.getInputFields('line_3')} label="Extra Line (optional)" />
                </Box>
                <Box width="100%" mb={5}>
                  <Field
                    {...form.getInputFields('billing_country_id')}
                    label={i18n._(t`Country`)}
                    type="select"
                    items={countriesSelection.map((country) => ({
                      label: country.name || '',
                      value: `${country.id}` || '',
                      inputLabel: country.name,
                    }))}
                  />
                </Box>
                <Box width="100%" mb={5}>
                  <Field
                    {...form.getInputFields('zip')}
                    label="Zip"
                    keyboardType="phone-pad"
                    onBlur={() => autofillStateCity('billing')}
                  />
                </Box>
                <Box mb={5} width="100%" style={{ flexDirection: 'row' }}>
                  <Box width="48.5%" style={{ marginRight: '3%' }}>
                    {billingCountry.states.length ? (
                      <Field
                        {...form.getInputFields('state')}
                        label={i18n._(t`State`)}
                        type="select"
                        items={billingCountry.states.map((state) => ({
                          label: state || '',
                          value: state || '',
                          inputLabel: state,
                        }))}
                        editable={!isBillingAddressAutoFilling}
                      />
                    ) : (
                      <Field
                        {...form.getInputFields('state')}
                        label="State"
                        editable={!isBillingAddressAutoFilling}
                      />
                    )}
                  </Box>
                  <Box width="48.5%">
                    {billingState && billingCountry.cities[billingState] ? (
                      <Field
                        {...form.getInputFields('city')}
                        label={i18n._(t`City/Suburb`)}
                        type="select"
                        items={billingCountry.cities[billingState].map((city) => ({
                          label: city || '',
                          value: city || '',
                          inputLabel: city,
                        }))}
                        editable={!isBillingAddressAutoFilling}
                      />
                    ) : (
                      <Field
                        {...form.getInputFields('city')}
                        label="City/Suburb"
                        editable={!isBillingAddressAutoFilling}
                      />
                    )}
                  </Box>
                </Box>
                <Box mb={5} width="100%" style={{ flexDirection: 'row' }}>
                  <Box width="48.5%" style={{ marginRight: '3%' }}>
                    <Field
                      {...form.getInputFields('country_code')}
                      label={i18n._(t`Calling Code`)}
                      type="select"
                      items={countries.map((country) => ({
                        label: `${country.name}  (${country.calling_code})` || '',
                        value: country.calling_code || '',
                        inputLabel: country.calling_code,
                      }))}
                    />
                  </Box>
                  <Box width="48.5%">
                    <Field
                      {...form.getInputFields('phone')}
                      label="Phone Number"
                      textContentType="telephoneNumber"
                      keyboardType="phone-pad"
                    />
                  </Box>
                </Box>

                <Box my={3} />

                <Text fontSize={3} fontFamily="bold">
                  <Trans>DELIVERY ADDRESS</Trans>
                </Text>
                <Box mb={5} width="100%">
                  <CheckBoxInput checked={isSameAddress} onChecked={toggleSameAddress}>
                    <Text fontSize={1}>
                      <Trans>Delivery address is same as my Billing address</Trans>
                    </Text>
                  </CheckBoxInput>
                </Box>
                {!isSameAddress && (
                  <>
                    <Box mb={5} width="100%" style={{ flexDirection: 'row' }}>
                      <Box width="48.5%" style={{ marginRight: '3%' }}>
                        <Field {...form.getInputFields('firstname2')} label="First name" />
                      </Box>
                      <Box width="48.5%">
                        <Field {...form.getInputFields('lastname2')} label="Last name" />
                      </Box>
                    </Box>
                    <Box width="100%" mb={5}>
                      <Field
                        {...form.getInputFields('line_4')}
                        label={
                          deliveryCountry.shortcode === 'AU'
                            ? i18n._(t`Address`)
                            : i18n._(t`Street Address`)
                        }
                      />
                    </Box>
                    <Box width="100%" mb={5}>
                      <Field
                        {...form.getInputFields('line_5')}
                        label={
                          deliveryCountry.shortcode === 'AU'
                            ? i18n._(t`Address Line 2 (optional)`)
                            : i18n._(t`App/Suite/Unit`)
                        }
                      />
                    </Box>
                    <Box width="100%" mb={5}>
                      <Field {...form.getInputFields('line_6')} label="Extra Line (optional)" />
                    </Box>
                    <Box width="100%" mb={5}>
                      <Field
                        type="select"
                        label={i18n._(t`Country`)}
                        {...form.getInputFields('country_id')}
                        items={countriesSelection.map((country) => ({
                          label: country.name || '',
                          value: `${country.id}` || '',
                        }))}
                      />
                    </Box>
                    <Box width="100%" mb={5}>
                      <Field
                        {...form.getInputFields('zip2')}
                        label="Zip"
                        onBlur={() => autofillStateCity('delivery')}
                        keyboardType="phone-pad"
                      />
                    </Box>

                    <Box mb={5} width="100%" style={{ flexDirection: 'row' }}>
                      <Box width="48.5%" style={{ marginRight: '3%' }}>
                        {deliveryCountry.states.length ? (
                          <Field
                            {...form.getInputFields('state2')}
                            label={i18n._(t`State`)}
                            type="select"
                            items={deliveryCountry.states.map((state) => ({
                              label: state || '',
                              value: state || '',
                              inputLabel: state,
                            }))}
                            editable={!isDeliveryAddressAutoFilling}
                          />
                        ) : (
                          <Field
                            {...form.getInputFields('state2')}
                            label="State"
                            editable={!isDeliveryAddressAutoFilling}
                          />
                        )}
                      </Box>
                      <Box width="48.5%">
                        {deliveryState && deliveryCountry.cities[deliveryState] ? (
                          <Field
                            {...form.getInputFields('city2')}
                            label={i18n._(t`City/Suburb`)}
                            type="select"
                            items={deliveryCountry.cities[deliveryState].map((city) => ({
                              label: city || '',
                              value: city || '',
                              inputLabel: city,
                            }))}
                            editable={!isDeliveryAddressAutoFilling}
                          />
                        ) : (
                          <Field
                            {...form.getInputFields('city2')}
                            label="City/Suburb"
                            editable={!isDeliveryAddressAutoFilling}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box mb={5} width="100%" style={{ flexDirection: 'row' }}>
                      <Box width="35%" style={{ marginRight: '3%' }}>
                        <Field
                          {...form.getInputFields('country_code2')}
                          label={i18n._(t`Calling Code`)}
                          type="select"
                          items={countries.map((country) => ({
                            label: `${country.name}  (${country.calling_code})` || '',
                            value: country.calling_code || '',
                            inputLabel: country.calling_code,
                          }))}
                        />
                      </Box>
                      <Box width="62%">
                        <Field
                          {...form.getInputFields('phone2')}
                          label="Phone Number"
                          textContentType="telephoneNumber"
                          keyboardType="phone-pad"
                        />
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </PageContainer>
        </ScrollContainer>

        <Footer>
          <>
            <ErrorMessage mb={4}>{form.formValidationError || formError}</ErrorMessage>

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
                loading={isSubmitting}
              />
            </Box>
          </>
        </Footer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

export default BuyingForm;
