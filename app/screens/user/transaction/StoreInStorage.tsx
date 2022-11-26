import { UserRoutes } from 'types/navigation';

import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { useQuery } from 'react-query';

import { TransactionBuyerType } from 'types/resources/transactionBuyer';
import StoreInStorageScreen from './components/store-in-storage/StoreInStorageScreen';

type TransactionRouteProp = RouteProp<UserRoutes, 'PurchaseDetails' | 'StoreInStorage'>;
const initialTransaction = {
  status: 'pending',
  size: '',
  buyer_country: {},
} as TransactionBuyerType;
const StoreInStorage = ({ route }: { route: TransactionRouteProp }) => {
  const id = route.params.sale_ref;

  const { data: transaction = initialTransaction } = useQuery<TransactionBuyerType>(
    [`me/sales/buying/${id}`],
    { initialData: initialTransaction }
  );

  if (!transaction?.id) return null;

  return <StoreInStorageScreen transaction={transaction} />;
};

export default StoreInStorage;
