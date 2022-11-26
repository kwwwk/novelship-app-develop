import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useStoreState, useStoreActions } from 'app/store';
import { Anchor, Box, Button, Text } from 'app/components/base';
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
import { UserRoutes } from 'types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { Keyboard } from 'react-native';
import getFaqLink from 'common/constants/faq';
import { COUNTRY_BANKS } from 'common/constants/user';
import { defaultCountry } from 'types/resources/country';
import { mapSecondAddress, userAddressMap } from 'common/utils/user';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import API from 'common/api';
import Analytics from 'app/services/analytics';

const SellingForm = ({ navigation, route }: StackScreenProps<UserRoutes, 'SellingForm'>) => {
  const limited = route.params?.limited;

  const user = useStoreState((s) => s.user.user);
  const countries = useStoreState((s) => s.country.countries);
  const countryGetById = useStoreState((s) => s.country.getById);
  const updateUser = useStoreActions((a) => a.user.update);

  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSameAddress, setIsSameAddress] = useState<boolean>(true);
  const [isAddressAutoFilling, setIsAddressAutoFilling] = React.useState<
    false | 'billing' | 'shipping'
  >(false);

  const isBillingAddressAutoFilling = isAddressAutoFilling === 'billing';
  const isShippingAddressAutoFilling = isAddressAutoFilling === 'shipping';

  const countriesSelection = [...countries];
  // @ts-ignore ignore
  countriesSelection.splice(6, 0, { name: '-' });

  const { selling_address, shipping_address, selling_country_id, shipping_country_id } = user;

  const userBillingCardCountry =
    countries.find((c) => c.selling_enabled && c.shortcode === user.stripe_seller.country) ||
    defaultCountry;

  const userBillingCountry = selling_country_id
    ? countryGetById(selling_country_id)
    : userBillingCardCountry;
  const userShippingCountry = countryGetById(shipping_country_id);

  const initialValues = {
    // Billing
    firstname: selling_address.firstname || user.firstname || '',
    lastname: selling_address.lastname || user.lastname || '',

    line_1: selling_address.line_1,
    line_2: selling_address.line_2,
    line_3: selling_address.line_3,
    city: userBillingCountry.cities[selling_address.state]
      ? userBillingCountry.cities[selling_address.state].includes(selling_address.city)
        ? selling_address.city
        : ''
      : selling_address.city,
    state: userBillingCountry.states.length
      ? userBillingCountry.states.includes(selling_address.state)
        ? selling_address.state
        : ''
      : selling_address.state,
    zip: selling_address.zip,
    phone: selling_address.phone || user.phone,

    selling_country_id: selling_country_id || '',
    country_code: selling_address.country_code || user.country_code || '',

    // Shipping
    firstname2: shipping_address.firstname || user.firstname || '',
    lastname2: shipping_address.lastname || user.lastname || '',

    line_4: shipping_address.line_1,
    line_5: shipping_address.line_2,
    line_6: shipping_address.line_3,
    city2: userShippingCountry.cities[shipping_address.state]
      ? userShippingCountry.cities[shipping_address.state].includes(shipping_address.city)
        ? shipping_address.city
        : ''
      : shipping_address.city,
    state2: userShippingCountry.states.length
      ? userShippingCountry.states.includes(shipping_address.state)
        ? shipping_address.state
        : ''
      : shipping_address.state,
    zip2: shipping_address.zip,
    phone2: shipping_address.phone || user.phone,

    shipping_country_id: shipping_country_id || '',
    country_code2: shipping_address.country_code || user.country_code || '',
    // payout
    account_type: user.payout_info.account_type,
    account_number: user.payout_info.account_number,
    account_number_new: '',
    bank_name: user.payout_info.bank_name,
    bank_country: user.payout_info.bank_country || '',
    // payout country specific fields
    dob: user.payout_info.dob,
    branch_code: user.payout_info.branch_code,
    bsb_code: user.payout_info.bsb_code,
    branch_name: user.payout_info.branch_name,
  };

  const SellingAddressSchema = Yup.object().shape({
    firstname: Yup.string()
      .required(i18n._(t`First Name is required`))
      .max(20, i18n._(t`Maximum 20 characters allowed`)),
    lastname: Yup.string()
      .required(i18n._(t`Last Name is required`))
      .max(20, i18n._(t`Maximum 20 characters allowed`)),
    selling_country_id: Yup.string()
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
        if (isAUAddress('shipping'))
          return Yup.string().max(35, i18n._(t`Maximum 35 characters allowed`));
        return Yup.string()
          .required(i18n._(t`Address is required`))
          .max(35, i18n._(t`Maximum 35 characters allowed`));
      }),
      line_6: Yup.string().max(35, i18n._(t`Maximum 35 characters allowed`)),
      shipping_country_id: Yup.string()
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

    dob: Yup.string().required(i18n._(t`Date of birth is required`)),
    bank_name: Yup.string().required(i18n._(t`Bank name is required`)),
    ...(initialValues.account_number
      ? { account_number_new: Yup.number().typeError(i18n._(t`Invalid account number`)) }
      : {
          account_number: Yup.number()
            .typeError(i18n._(t`Invalid account number`))
            .required(i18n._(t`Account number is required`)),
        }),
    bsb_code: Yup.string()
      .matches(/^[0-9]{6}$/, i18n._(t`Only 6 digits numeric characters allowed`))
      .test('bsb_code', i18n._(t`BSB code is required`), function (value) {
        const { parent } = this;
        const shipFromCountry = countryGetById(parent.shipping_country_id);
        return !(shipFromCountry.shortcode === 'AU' && !value);
      }),
    branch_code: Yup.string()
      .matches(/^[0-9]{3}$/, i18n._(t`Only 3 digits numeric characters allowed`))
      .test('branch_code', i18n._(t`Branch code is required`), function (value) {
        const { parent } = this;
        const shipFromCountry = countryGetById(parent.shipping_country_id);
        return !(shipFromCountry.shortcode === 'JP' && !value);
      }),
    branch_name: Yup.string().test(
      'branch_name',
      i18n._(t`Branch Name is required`),
      function (value) {
        const { parent } = this;
        const shipFromCountry = countryGetById(parent.shipping_country_id);
        return !(shipFromCountry.shortcode === 'TW' && !value);
      }
    ),
  });

  const submit = (values: any) => {
    setIsSubmitting(true);
    Keyboard.dismiss();
    const data = {
      selling_address: {
        firstname: values.firstname,
        lastname: values.lastname,
        line_1: values.line_1,
        line_2: values.line_2,
        line_3: values.line_3,
        city: values.city,
        state: values.state,
        zip: values.zip,
        country_code: values.country_code,
        phone: values.phone,
      },
      selling_country_id: parseInt(values.selling_country_id, 10),
      shipping_address: mapSecondAddress(values),
      shipping_country_id: parseInt(values.shipping_country_id, 10),
      payout_info: {
        account_type: values.account_type,
        bank_name: values.bank_name,
        bank_country: '',
        account_number: values.account_number_new || values.account_number,
        dob: values.dob,
        branch_code: values.branch_code,
        bsb_code: values.bsb_code,
        branch_name: values.branch_name,
      },
    };

    if (isSameAddress) {
      data.shipping_address = data.selling_address;
      data.shipping_country_id = data.selling_country_id;
    }
    data.payout_info.bank_country = countryGetById(data.shipping_country_id).shortcode;

    updateUser(data)
      .then(() => {
        cacheSet('is_shipping_same', isSameAddress);
        Analytics.profileUpdate('selling');
        navigation.goBack();
      })
      .catch(setFormError)
      .finally(() => setIsSubmitting(false));
  };

  const form = useForm<typeof initialValues>({
    initialValues,
    submit,
    validationSchema: SellingAddressSchema,
  });

  const billingCountry = countryGetById(form.getInputFields('selling_country_id').value);
  const shippingCountry = countryGetById(form.getInputFields('shipping_country_id').value);
  function isAUAddress(addressType: 'billing' | 'shipping') {
    return addressType === 'billing'
      ? billingCountry.shortcode === 'AU'
      : addressType === 'shipping'
      ? shippingCountry.shortcode === 'AU'
      : false;
  }
  const shippingCountryBanks = COUNTRY_BANKS[shippingCountry.shortcode];
  const billingState = form.getInputFields('state').value;
  const shippingState = form.getInputFields('state2').value;

  const autofillStateCity = (addressType: 'billing' | 'shipping') => {
    setIsAddressAutoFilling(addressType);

    const filedSuffix = addressType === 'billing' ? '' : '2';
    const zip = form.getInputFields(`zip${filedSuffix}`).value;
    const country = (addressType === 'billing' ? billingCountry : shippingCountry).shortcode;

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
        selling_country_id: 'shipping_country_id',
      } as typeof initialValues;
      Object.keys(fields).forEach((k) => {
        // @ts-ignore override
        form.setFieldValue(fields[k], form.getInputFields(k).value);
      });
    }
    setIsSameAddress(!isSameAddress);
  };

  useEffect(() => {
    cacheGet<boolean>('is_shipping_same').then((d) => {
      if (d === undefined) {
        cacheSet('is_shipping_same', true);
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
    // if Same Address, set shipping country id here to avoid further checks for payout details
    if (isSameAddress) {
      form.setFieldValue('shipping_country_id', billingCountry.id);
    }
  }, [billingCountry.id]);

  useOnUpdatedOnly(() => {
    form.setFieldValue('state2', '');
    form.setFieldValue('city2', '');
    form.setFieldValue('zip2', '');
    form.setFieldValue('country_code2', shippingCountry.calling_code);
  }, [shippingCountry.id]);

  useOnUpdatedOnly(() => {
    form.setFieldValue('bank_name', '');
    form.setFieldValue('dob', '');
    form.setFieldValue('bsb_code', '');
    form.setFieldValue('branch_code', '');
    form.setFieldValue('branch_name', '');
  }, [shippingCountry.id]);

  useOnUpdatedOnly(() => {
    if (userBillingCardCountry.id) {
      form.setFieldValue('selling_country_id', userBillingCardCountry.id);
    }
  }, [userBillingCardCountry.id]);

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <PageContainer mt={5} mb={10}>
            <PaymentCardInput mode="seller" title={i18n._(t`CREDIT/DEBIT CARD`)} />

            <Box my={6} height={1} bg="dividerGray" />

            <Text fontSize={3} fontFamily="bold">
              <Trans>BILLING ADDRESS</Trans>
            </Text>
            <Box my={4} />
            <Box px={1}>
              <Box>
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
                    {...form.getInputFields('selling_country_id')}
                    label={i18n._(t`Country`)}
                    editable={!limited}
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
                  <Trans>SHIPPING FROM ADDRESS</Trans>
                </Text>
                <Box mb={5} width="100%">
                  <CheckBoxInput checked={isSameAddress} onChecked={toggleSameAddress}>
                    <Text fontSize={1}>
                      <Trans>Shipping from address is same as my Billing address</Trans>
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
                          shippingCountry.shortcode === 'AU'
                            ? i18n._(t`Address`)
                            : i18n._(t`Street Address`)
                        }
                      />
                    </Box>
                    <Box width="100%" mb={5}>
                      <Field
                        {...form.getInputFields('line_5')}
                        label={
                          shippingCountry.shortcode === 'AU'
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
                        {...form.getInputFields('shipping_country_id')}
                        editable={!limited}
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
                        keyboardType="phone-pad"
                        onBlur={() => autofillStateCity('shipping')}
                      />
                    </Box>

                    <Box mb={5} width="100%" style={{ flexDirection: 'row' }}>
                      <Box width="48.5%" style={{ marginRight: '3%' }}>
                        {shippingCountry.states.length ? (
                          <Field
                            {...form.getInputFields('state2')}
                            label={i18n._(t`State`)}
                            type="select"
                            items={shippingCountry.states.map((state) => ({
                              label: state || '',
                              value: state || '',
                              inputLabel: state,
                            }))}
                            editable={!isShippingAddressAutoFilling}
                          />
                        ) : (
                          <Field
                            {...form.getInputFields('state2')}
                            label="State"
                            editable={!isShippingAddressAutoFilling}
                          />
                        )}
                      </Box>
                      <Box width="48.5%">
                        {shippingState && shippingCountry.cities[shippingState] ? (
                          <Field
                            {...form.getInputFields('city2')}
                            label={i18n._(t`City/Suburb`)}
                            type="select"
                            items={shippingCountry.cities[shippingState].map((city) => ({
                              label: city || '',
                              value: city || '',
                              inputLabel: city,
                            }))}
                            editable={!isShippingAddressAutoFilling}
                          />
                        ) : (
                          <Field
                            {...form.getInputFields('city2')}
                            label="City/Suburb"
                            editable={!isShippingAddressAutoFilling}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box mb={5} width="100%" style={{ flexDirection: 'row' }}>
                      <Box width="48.5%" style={{ marginRight: '3%' }}>
                        <Field
                          {...form.getInputFields('country_code2')}
                          label={i18n._(t`Calling Code`)}
                          type="select"
                          items={countriesSelection.map((country) => ({
                            label: `${country.name}  (${country.calling_code})` || '',
                            value: country.calling_code || '',
                            inputLabel: country.calling_code,
                          }))}
                        />
                      </Box>
                      <Box width="48.5%">
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
            <Box my={6} height={1} bg="dividerGray" />

            <Text fontSize={3} fontFamily="bold">
              <Trans>PAYOUT BANK</Trans>
            </Text>
            <Text fontSize={1} mt={4}>
              <Trans>
                Note: Please fill in the full name as registered with your payout bank. See{' '}
                <Anchor
                  textDecorationLine="underline"
                  fontSize={1}
                  to={getFaqLink('payout_request')}
                >
                  here
                </Anchor>{' '}
                for more details.
              </Trans>
            </Text>
            <Box my={4} />
            <Box px={1}>
              <Box>
                <Box mb={6} width="100%" style={{ flexDirection: 'row' }}>
                  <Box width="48.5%" style={{ marginRight: '3%' }}>
                    <Field {...form.getInputFields('firstname')} label="First name" />
                  </Box>
                  <Box width="48.5%">
                    <Field {...form.getInputFields('lastname')} label="Last name" />
                  </Box>
                </Box>
                <Box mb={6} width="100%" style={{ flexDirection: 'row' }}>
                  <Box width="100%">
                    {shippingCountryBanks && shippingCountryBanks.length > 0 ? (
                      <Field
                        {...form.getInputFields('bank_name')}
                        label={i18n._(t`Bank Name`)}
                        type="select"
                        items={shippingCountryBanks.map((bank) => ({
                          label: bank || '',
                          value: bank || '',
                        }))}
                      />
                    ) : (
                      <Field {...form.getInputFields('bank_name')} label="Bank Name" />
                    )}
                  </Box>
                </Box>
                <Box mb={6} width="100%" style={{ flexDirection: 'row' }}>
                  <Box width="48.5%" style={{ marginRight: '3%' }}>
                    <Field
                      {...form.getInputFields('account_type')}
                      label={i18n._(t`Account Type`)}
                      type="select"
                      items={[
                        { label: i18n._(t`Savings`), value: 'savings' },
                        { label: i18n._(t`Checking`), value: 'checking' },
                      ]}
                    />
                  </Box>
                  <Box width="48.5%" style={{ marginRight: '3%' }}>
                    <Field
                      {...form.getInputFields('dob')}
                      type="date"
                      label={i18n._(t`Date of birth`)}
                    />
                  </Box>
                </Box>
              </Box>
              {['AU', 'JP', 'TW'].includes(shippingCountry.shortcode) && (
                <>
                  <Box mb={6} width="100%">
                    {shippingCountry.shortcode === 'AU' ? (
                      <Field
                        {...form.getInputFields('bsb_code')}
                        placeholder="BSB Code (NNNNNN)"
                        keyboardType="numeric"
                      />
                    ) : shippingCountry.shortcode === 'TW' ? (
                      <Field {...form.getInputFields('branch_name')} placeholder="Branch Name" />
                    ) : (
                      <Field
                        {...form.getInputFields('branch_code')}
                        placeholder="Branch Code (NNN)"
                        keyboardType="numeric"
                      />
                    )}
                  </Box>
                </>
              )}
              {initialValues.account_number ? (
                <>
                  <Box mb={6} width="100%" style={{ flexDirection: 'row' }}>
                    <Box width="100%" style={{ marginRight: '3%' }}>
                      <Field
                        name="bank_account_number"
                        label="Current Beneficiary Bank Account Number"
                        value={initialValues.account_number}
                        editable={false}
                      />
                    </Box>
                  </Box>
                  <Box mb={6} width="100%" style={{ flexDirection: 'row' }}>
                    <Box width="100%" style={{ marginRight: '3%' }}>
                      <Field
                        {...form.getInputFields('account_number_new')}
                        label="Update Current Beneficiary Bank Account"
                      />
                    </Box>
                  </Box>
                </>
              ) : (
                <Box mb={6} width="100%" style={{ flexDirection: 'row' }}>
                  <Box width="100%" style={{ marginRight: '3%' }}>
                    <Field
                      {...form.getInputFields('account_number')}
                      label="Beneficiary Bank Account Number"
                    />
                  </Box>
                </Box>
              )}
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

export default SellingForm;
