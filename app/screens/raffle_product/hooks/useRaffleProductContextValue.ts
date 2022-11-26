import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { Alert } from 'react-native';
import { useQuery } from 'react-query';
import { StackScreenProps } from '@react-navigation/stack';

import { useStoreState } from 'app/store';
import { RootRoutes } from 'types/navigation';
import { navigateBackOrGoToHome } from 'app/services/navigation';
import { defaultRaffleProduct, RaffleProductType } from 'types/resources/raffleProduct';

const useRaffleProductContextValue = ({
  route,
  navigation,
}: StackScreenProps<RootRoutes, 'RaffleProductStack'>) => {
  const productSlug = route.params.slug;
  const user = useStoreState((s) => s.user.user);
  const currentCurrencyID = useStoreState((s) => s.currency.current.id);

  const onError = (err: unknown) =>
    // @ts-ignore ignore
    Alert.alert('', i18n._(err), [
      {
        text: i18n._(t`OK`),
        onPress: () => navigateBackOrGoToHome(navigation),
      },
    ]);

  const productQueryKey = [
    `raffle_products/slug/${productSlug}`,
    { modifier: { currency_id: currentCurrencyID } },
  ];
  const {
    data: raffleProduct = defaultRaffleProduct,
    isFetching,
    refetch: refetchRaffleProduct,
  } = useQuery<RaffleProductType>(productQueryKey, {
    onError,
    initialData: defaultRaffleProduct,
    retry: false,
  });

  const {
    data: raffleRegistered = { isUserRaffleRegistered: false },
    refetch: refetchRaffleRegistered,
  } = useQuery<{
    isUserRaffleRegistered: boolean;
  }>([`me/raffle_product_entry/${raffleProduct.id}/check-registered`], {
    initialData: { isUserRaffleRegistered: false },
    enabled: !!raffleProduct && !!user.id,
  });

  return {
    raffleProduct,
    isFetching,
    refetchRaffleProduct,
    raffleRegistered,
    refetchRaffleRegistered,
  };
};

export default useRaffleProductContextValue;
