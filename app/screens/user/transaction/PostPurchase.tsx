import { UserRoutes } from 'types/navigation';

import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { useQuery } from 'react-query';

import { TransactionBuyerType } from 'types/resources/transactionBuyer';
import PostPurchaseScreen from './components/post-purchase/PostPurchaseScreen';

type TransactionRouteProp = RouteProp<UserRoutes, 'PurchaseDetails' | 'PostPurchase'>;
const initialTransaction = {
  status: 'pending',
  size: '',
  buyer_country: {},
} as TransactionBuyerType;
const PostPurchase = ({ route }: { route: TransactionRouteProp }) => {
  const id = route.params.sale_ref;
  const mode = /Purchase/.test(route.name) ? 'buying' : 'selling';

  const { data: transaction = initialTransaction } = useQuery<TransactionBuyerType>(
    [`me/sales/${mode}/${id}`],
    { initialData: initialTransaction }
  );

  if (!transaction?.id) return null;

  return <PostPurchaseScreen transaction={transaction} />;
};

export default PostPurchase;
