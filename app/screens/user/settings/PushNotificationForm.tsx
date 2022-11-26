import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useStoreActions, useStoreState } from 'app/store';
import useForm from 'app/hooks/useForm';

import { UserRoutes } from 'types/navigation';
import { Box, Button, Text } from 'app/components/base';
import { Field, Select } from 'app/components/form';
import ErrorMessage from 'app/components/form/ErrorMessage';
import useOnUpdatedOnly from 'app/hooks/useOnUpdatedOnly';

import {
  Footer,
  KeyboardAwareContainer,
  PageContainer,
  ScrollContainer,
  SafeAreaScreenContainer,
} from 'app/components/layout';
import Analytics from 'app/services/analytics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import usePushState from 'app/hooks/usePushState';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import NotificationPanel from '../components/NotificationPanel';

let i = 0;
const highestOfferPercentRange = Array.from({ length: 19 })
  .fill(0)
  .map(() => `${(i += 5)}`);

const PushNotificationForm = ({
  navigation,
}: StackScreenProps<UserRoutes, 'PushNotificationForm'>) => {
  const preferences = useStoreState((s) => s.user.user.notification_preferences);
  const updateUser = useStoreActions((a) => a.user.update);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [showReason, setShowReason] = useState<boolean>(false);
  const [selectReason, setSelectReason] = useState<string>('');
  const { isPushEnabled, onPushSettingChanged } = usePushState();

  const reasons = [
    {
      label: i18n._(t`I receive too many emails`),
      value: 'too_many_emails',
    },
    {
      label: i18n._(t`The content I receive is not relevant`),
      value: 'irrelevant_content',
    },
    {
      label: i18n._(t`I’m taking a break from sneakers and apparel`),
      value: 'break_from_sneaker_apparel',
    },
    { label: i18n._(t`Other`), value: 'other' },
  ];

  const initialValues = {
    push_buyer_new_highest_offer: preferences.buyer_new_highest_offer.push,
    email_buyer_new_highest_offer: preferences.buyer_new_highest_offer.email,

    push_buyer_new_lowest_list: preferences.buyer_new_lowest_list.push,
    email_buyer_new_lowest_list: preferences.buyer_new_lowest_list.email,

    push_offer_expiring: preferences.offer_expiring.push,

    push_wishlist_new_lowest_list: preferences.wishlist_new_lowest_list.push,
    email_wishlist_new_lowest_list: preferences.wishlist_new_lowest_list.email,

    push_wishlist_instant_delivery_available: preferences.wishlist_instant_delivery_available.push,
    email_wishlist_instant_delivery_available:
      preferences.wishlist_instant_delivery_available.email,

    push_wishlist_new_highest_offer: preferences.wishlist_new_highest_offer.push,

    push_seller_new_lowest_list: preferences.seller_new_lowest_list.push,
    email_seller_new_lowest_list: preferences.seller_new_lowest_list.email,

    push_seller_new_highest_offer: preferences.seller_new_highest_offer.push,
    email_seller_new_highest_offer: preferences.seller_new_highest_offer.email,
    threshold_seller_new_highest_offer: preferences.seller_new_highest_offer.threshold || 85,

    push_list_expiring: preferences.list_expiring.push,

    push_sale_updates: preferences.sale_updates.push,

    email_promotions: preferences.promotions.email,
    push_promotions: preferences.promotions.push,
  };

  type NotificationItemType = {
    title: string;
    subTitle: string;
    type: 'both' | 'email' | 'push';
    email_field?: keyof typeof initialValues;
    push_field?: keyof typeof initialValues;
    threshold?: boolean;
  };

  const buyer_notification: NotificationItemType[] = [
    {
      title: i18n._(t`Offer, New Highest Offer`),
      subTitle: i18n._(
        t`Sent when a new highest Offer is placed on a product you have an active Offer on`
      ),
      type: 'both',
      email_field: 'email_buyer_new_highest_offer',
      push_field: 'push_buyer_new_highest_offer',
    },
    {
      title: i18n._(t`Offer, New Lowest List`),
      subTitle: i18n._(
        t`Sent when a new Lowest List is placed on a product you have an active Offer on.`
      ),
      type: 'both',
      email_field: 'email_buyer_new_lowest_list',
      push_field: 'push_buyer_new_lowest_list',
    },
    {
      title: i18n._(t`Offer Expiring`),
      subTitle: i18n._(t`Sent 24 hours before your active Offer expires.`),
      type: 'push',
      push_field: 'push_offer_expiring',
    },
  ];

  const wishlist_notification: NotificationItemType[] = [
    {
      title: i18n._(t`New Lowest List Price`),
      subTitle: i18n._(
        t`Sent when a new lowest list price is placed on the product and size you have added to Wishlist`
      ),
      type: 'both',
      email_field: 'email_wishlist_new_lowest_list',
      push_field: 'push_wishlist_new_lowest_list',
    },
    {
      title: i18n._(t`Instant Delivery Available`),
      subTitle: i18n._(
        t`Sent when the product and size you have added to Wishlist is instant delivery available`
      ),
      type: 'both',
      email_field: 'email_wishlist_instant_delivery_available',
      push_field: 'push_wishlist_instant_delivery_available',
    },
    {
      title: i18n._(t`New Highest Offer Price`),
      subTitle: i18n._(
        t`Sent when a new highest offer price is placed on the product and size you have added to Wishlist`
      ),
      type: 'push',
      push_field: 'push_wishlist_new_highest_offer',
    },
  ];

  const seller_notification: NotificationItemType[] = [
    {
      title: i18n._(t`List, New Lowest List`),
      subTitle: i18n._(
        t`Sent when a new Lowest List is placed for a product you have an active List on.`
      ),
      type: 'both',
      email_field: 'email_seller_new_lowest_list',
      push_field: 'push_seller_new_lowest_list',
    },
    {
      title: i18n._(t`List, New Highest Offer`),
      subTitle: i18n._(
        t`Sent when a new Highest Offer is placed on a product that is at least X percent of your List`
      ),
      type: 'both',
      email_field: 'email_seller_new_highest_offer',
      push_field: 'push_seller_new_highest_offer',
      threshold: true,
    },
    {
      title: i18n._(t`List Expiring`),
      subTitle: i18n._(t`Sent 24 hours before your active List expires.`),
      type: 'push',
      push_field: 'push_list_expiring',
    },
  ];

  const general_notification: NotificationItemType[] = [
    {
      title: i18n._(t`Order Status Updates`),
      subTitle: i18n._(t`Sent when order status is changed.`),
      type: 'push',
      push_field: 'push_sale_updates',
    },
  ];
  const promotional_notification: NotificationItemType[] = [
    {
      title: i18n._(t`Promotions, Latest Releases & News`),
      subTitle: '',
      type: 'both',
      email_field: 'email_promotions',
      push_field: 'push_promotions',
    },
  ];
  type NotificationItemHolderType = {
    heading: string;
    content: NotificationItemType[];
  };

  const notifications: NotificationItemHolderType[] = [
    { heading: i18n._(t`BUYING NOTIFICATIONS`), content: buyer_notification },
    { heading: i18n._(t`SELLING NOTIFICATIONS`), content: seller_notification },
    { heading: i18n._(t`WISHLIST NOTIFICATIONS`), content: wishlist_notification },
    { heading: i18n._(t`GENERAL NOTIFICATIONS`), content: general_notification },
    { heading: i18n._(t`PROMOTIONAL NOTIFICATIONS`), content: promotional_notification },
  ];

  const submit = (values: typeof initialValues) => {
    setIsSubmitting(true);

    const data = {
      notification_preferences: {
        ...preferences,
        buyer_new_highest_offer: {
          push: values.push_buyer_new_highest_offer,
          email: values.email_buyer_new_highest_offer,
        },
        buyer_new_lowest_list: {
          push: values.push_buyer_new_lowest_list,
          email: values.email_buyer_new_lowest_list,
        },
        wishlist_new_lowest_list: {
          push: values.push_wishlist_new_lowest_list,
          email: values.email_wishlist_new_lowest_list,
        },
        wishlist_instant_delivery_available: {
          push: values.push_wishlist_instant_delivery_available,
          email: values.email_wishlist_instant_delivery_available,
        },
        wishlist_new_highest_offer: {
          push: values.push_wishlist_new_highest_offer,
        },
        seller_new_lowest_list: {
          push: values.push_seller_new_lowest_list,
          email: values.email_seller_new_lowest_list,
        },
        seller_new_highest_offer: {
          push: values.push_seller_new_highest_offer,
          email: values.email_seller_new_highest_offer,
          threshold:
            typeof values.threshold_seller_new_highest_offer === 'string'
              ? parseInt(values.threshold_seller_new_highest_offer, 10)
              : values.threshold_seller_new_highest_offer,
        },
        offer_expiring: { push: values.push_offer_expiring },
        list_expiring: { push: values.push_list_expiring },
        sale_updates: { push: values.push_sale_updates },
        promotions: { push: values.push_promotions, email: values.email_promotions },
      },
    };

    return updateUser(data)
      .then(() => {
        Analytics.profileUpdate('notification');
        Analytics.unsubscribeEmail(!values.email_promotions, selectReason);
        navigation.goBack();
      })
      .catch(setFormError)
      .finally(() => setIsSubmitting(false));
  };

  const form = useForm<typeof initialValues>({ initialValues, submit });

  const emailPromotions = form.getInputFields('email_promotions').value;

  useOnUpdatedOnly(() => {
    if (!emailPromotions) {
      setShowReason(true);
    } else {
      setShowReason(false);
    }
  }, [emailPromotions]);

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <PageContainer mb={10}>
            {!isPushEnabled && (
              <Box mt={5}>
                <Button
                  variant="white"
                  onPress={onPushSettingChanged}
                  text={i18n._(t`TURN ON PUSH NOTIFICATIONS`)}
                  size="sm"
                />
              </Box>
            )}

            {notifications.map((notification, index) => (
              <Box key={index} mt={5} mb={3} width="100%">
                <Text fontSize={3} fontFamily="medium">
                  {notification.heading}
                </Text>

                {notification.content.map((c, key) => (
                  <Box key={key}>
                    <NotificationPanel title={c.title} subTitle={c.subTitle} type={c.type}>
                      <>
                        {c.threshold && (
                          <Box
                            alignItems="center"
                            flexDirection="row"
                            justifyContent="space-between"
                            mt={3}
                            mb={4}
                          >
                            <Box width="70%">
                              <Text fontSize={2}>
                                <Trans>Threshold Percentage</Trans>
                              </Text>
                            </Box>
                            <Box width="23%">
                              <Field
                                {...form.getInputFields('threshold_seller_new_highest_offer')}
                                label=""
                                type="select"
                                items={highestOfferPercentRange.map((hop) => ({
                                  label: `${hop}%` || '',
                                  value: hop || '',
                                  inputLabel: `${hop}%`,
                                }))}
                              />
                            </Box>
                          </Box>
                        )}
                        {c.email_field && (
                          <Box flexDirection="row" justifyContent="space-between" mt={2} mb={3}>
                            <Box flexDirection="row" alignItems="center" pt={2}>
                              <MaterialCommunityIcons name="email-outline" size={20} />
                              <Text fontSize={3} fontFamily="medium" ml={3}>
                                <Trans>Email</Trans>
                              </Text>
                            </Box>
                            <Field {...form.getInputFields(c.email_field)} type="switch" />
                          </Box>
                        )}
                        {showReason && c.email_field === 'email_promotions' && (
                          <Box my={3}>
                            <Text fontSize={2} mb={1}>
                              <Trans>Reason for Unsubscribing</Trans>
                            </Text>
                            <Select
                              onChangeText={(reason) => setSelectReason(reason)}
                              value={selectReason}
                              items={reasons}
                              placeholder="Select Reason"
                            />
                          </Box>
                        )}
                        {c.push_field && (
                          <Box flexDirection="row" justifyContent="space-between" mb={4}>
                            <Box flexDirection="row" alignItems="center" pt={2}>
                              <MaterialCommunityIcons name="bell-ring-outline" size={20} />
                              <Text fontSize={3} fontFamily="medium" ml={3}>
                                <Trans>Push</Trans>
                              </Text>
                            </Box>
                            <Field {...form.getInputFields(c.push_field)} type="switch" />
                          </Box>
                        )}
                      </>
                    </NotificationPanel>
                  </Box>
                ))}
              </Box>
            ))}
          </PageContainer>
        </ScrollContainer>
        <Footer>
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
              loading={isSubmitting}
            />
          </Box>
        </Footer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

export default PushNotificationForm;
