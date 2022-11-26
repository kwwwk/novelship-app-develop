import { RaffleRoutes, RootRoutes } from 'types/navigation';

import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { CompositeNavigationProp, RouteProp, useLinkTo } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Box, Button, ButtonBase, ImgixImage, Text } from 'app/components/base';
import ConfirmationTick from 'app/components/icons/ConfirmationTick';
import {
  Footer,
  PageContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import { useStoreState } from 'app/store';
import theme from 'app/styles/theme';
import { LB } from 'common/constants';

import { toDate } from 'common/utils/time';
import {
  defaultRaffleProductEntry,
  RaffleProductEntryType,
} from 'types/resources/raffleProductEntry';
import ListItem from '../product/components/common/ListItem';
import RaffleProductCheckoutContext from './context';

type ConfirmedRouteProp = RouteProp<RaffleRoutes, 'RaffleProductConfirmed'>;
type ConfirmedNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RaffleRoutes, 'RaffleProductConfirmed'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

const RaffleProductConfirmed = ({
  navigation,
  route,
}: {
  navigation: ConfirmedNavigationProp;
  route: ConfirmedRouteProp;
}) => {
  const linkTo = useLinkTo();

  const { id } = route.params;
  const user = useStoreState((s) => s.user.user);
  const currentLanguage = useStoreState((s) => s.language.current);
  const { data: item = defaultRaffleProductEntry } = useQuery<RaffleProductEntryType>(
    [`me/raffle_product_entry/${id}`],
    { initialData: defaultRaffleProductEntry }
  );
  const { currency } = item;
  const { address } = user;
  address.country = user.country;
  const { raffleProduct, refetchRaffleProduct, refetchRaffleRegistered } = useContext(
    RaffleProductCheckoutContext
  );
  const { $$: _$$ } = useCurrencyUtils();
  const $$ = (input: number) => _$$(input, currency);

  const navigateToProductHome = () => {
    navigation.popToTop();
    navigation.navigate('RaffleProductStack', {
      screen: 'RaffleProduct',
      slug: raffleProduct.product.name_slug,
    });
  };
  const endDateTime = toDate(raffleProduct.end_date, 'DD/MM/YYYY - hh:mm');

  useEffect(() => {
    refetchRaffleProduct();
    refetchRaffleRegistered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // @ts-ignore ignore
  const secondaryCTAText = raffleProduct[`cta_text_${currentLanguage}`] || raffleProduct.cta_text;
  const secondaryCTALink = raffleProduct.cta_link;

  return (
    <SafeAreaScreenContainer>
      <ScrollContainer>
        <PageContainer mt={4}>
          <Box borderBottomWidth={1} borderBottomColor="dividerGray" pb={5}>
            <Box center>
              <ConfirmationTick width={64} height={64} />
              <Text fontFamily="bold" textTransform="uppercase" mt={2} fontSize={4}>
                <Trans>Congratulations!</Trans>
              </Text>
            </Box>

            <Text textAlign="center" fontSize={2} mt={4} mb={2}>
              {i18n._(
                t`Your entry is in.${LB} When the raffle closes on ${endDateTime} ${LB} we'll notify you within 3 hours of the raffle closing.`
              )}
            </Text>

            <Box py={4} mt={4} backgroundColor="yellow" borderRadius={4}>
              <Box
                px={4}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box ml={3} mr={3}>
                  <MaterialCommunityIcons
                    name="bell-ring-outline"
                    size={36}
                    color={theme.colors.textBlack}
                  />
                </Box>
                <Box p={5} />
                <Text fontSize={2} mr={5} lineHeight={20}>
                  <Trans>
                    Get notified when you win the raffle!{'\n'}Enable notifications in your
                    settings.
                  </Trans>
                </Text>
              </Box>
              <Box mt={3} mr={6} alignItems="flex-end">
                <Button
                  variant="white"
                  style={{ backgroundColor: 'transparent', borderWidth: 2 }}
                  width="30%"
                  size="sm"
                  text={i18n._(t`SETTINGS`)}
                  onPress={() =>
                    navigation.navigate('UserStack', { screen: 'PushNotificationForm' })
                  }
                />
              </Box>
            </Box>
          </Box>

          <Box mt={5}>
            <Text textAlign="center" fontFamily="bold" fontSize={3} mb={8}>
              <Trans>RAFFLE ENTRY DETAILS</Trans>
            </Text>

            <ButtonBase onPress={() => navigateToProductHome()}>
              <ImgixImage src={raffleProduct.product.image} height={64} />
            </ButtonBase>

            <Text mt={8} textAlign="center" fontFamily="medium" fontSize={5} lineHeight={28} mx={6}>
              {raffleProduct.product.name}
            </Text>

            <Box my={8}>
              {!raffleProduct.product.is_one_size && (
                <ListItem>
                  <Text fontFamily="regular" fontSize={2}>
                    <Trans>Size</Trans>
                  </Text>
                  <Text fontFamily="regular" fontSize={2}>
                    {item.local_size}
                  </Text>
                </ListItem>
              )}
              <ListItem>
                <Text fontFamily="regular" fontSize={2}>
                  <Trans>Authenticity</Trans>
                </Text>
                <Text fontFamily="regular" fontSize={2}>
                  <Trans>100% Certified Authentic</Trans>
                </Text>
              </ListItem>

              <ListItem>
                <Text fontFamily="regular" fontSize={2}>
                  <Trans>Condition</Trans>
                </Text>
                <Text fontFamily="regular" fontSize={2}>
                  <Trans>Brand New</Trans>
                </Text>
              </ListItem>

              <ListItem>
                <Text fontFamily="regular" fontSize={2}>
                  <Trans>Delivery Method</Trans>
                </Text>
                <Text fontFamily="regular" fontSize={2}>
                  <Trans>Normal Delivery</Trans>
                </Text>
              </ListItem>

              <ListItem>
                <Text fontFamily="bold" fontSize={2}>
                  <Trans>Total Price</Trans>
                </Text>
                <Text fontFamily="bold" fontSize={2}>
                  {$$(item.local_price)}
                </Text>
              </ListItem>

              <ListItem>
                <Text fontFamily="regular" fontSize={2}>
                  <Trans>Delivery To</Trans>
                </Text>
                <Text fontFamily="regular" fontSize={2} textAlign="right" style={{ width: 200 }}>
                  {` ${address.line_1},
                  ${address.line_2}, ${address.city}, ${address.state}
                  ${address.country.name}, ${address.zip}`}
                </Text>
              </ListItem>
            </Box>

            {secondaryCTAText && raffleProduct.cta_link ? (
              <Button
                variant="lightGray"
                size="lg"
                text={secondaryCTAText}
                onPress={() =>
                  linkTo(
                    secondaryCTALink.startsWith('/') ? secondaryCTALink : `/${secondaryCTALink}`
                  )
                }
              />
            ) : (
              <Button
                variant="lightGray"
                size="lg"
                text={i18n._(t`HEAD TO EVENT PAGE`)}
                onPress={() => navigateToProductHome()}
              />
            )}
          </Box>
        </PageContainer>
      </ScrollContainer>
      <Footer>
        <Button
          variant="black"
          size="lg"
          text={i18n._(t`CONTINUE BROWSING`)}
          onPress={() =>
            navigation.navigate('BottomNavStack', {
              screen: 'HomeStack',
              params: { screen: raffleProduct.product.class },
            })
          }
        />
      </Footer>
    </SafeAreaScreenContainer>
  );
};

export default RaffleProductConfirmed;
