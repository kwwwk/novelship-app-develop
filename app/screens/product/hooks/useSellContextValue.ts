import { OfferListType } from 'types/resources/offerList';
import { ProductType } from 'types/resources/product';

import { useEffect, useState } from 'react';

import { getHighLowOfferList, HighLowOfferListsType } from 'common/utils/offerLists';
import { getSell, getList, getSuggestedListPrice } from 'common/utils/sell';
import { useStoreState } from 'app/store';

const useSellContextValue = ({
  params,
  highLowOfferLists,
  product,
  offerLists,
  getDisplaySize,
}: {
  params: Record<string, any>;
  highLowOfferLists: HighLowOfferListsType;
  product: ProductType;
  offerLists: OfferListType[];
  getDisplaySize: (_: string) => {
    displaySize: string | number;
    collatedTranslatedSize: string;
    defaultSize: string;
  };
}) => {
  const user = useStoreState((s) => s.user.user);

  const { offer_list_id, edit, size, price, sale_storage_ref, expiration: listExpiration } = params;
  const [listPrice, setListPrice] = useState<number>();
  const [expiration, setExpiration] = useState<number>(listExpiration || 30);

  const { highestOfferPrice, lowestListPrice } = getHighLowOfferList(highLowOfferLists, size);

  const sellContext = { product, user, sale_storage_ref };
  let sell;
  if (offer_list_id === 'list' || edit) {
    const list = { size, local_price: listPrice, expiration, id: offer_list_id };
    const { collatedTranslatedSize } = getDisplaySize(size);
    sell = {
      local_size: collatedTranslatedSize,
      ...getList({ ...sellContext, list }),
      isEdit: edit,
    };
  } else {
    const offer = offerLists.find((o) => o.id === offer_list_id) || { size };
    const { collatedTranslatedSize } = getDisplaySize(offer?.size || '');
    sell = {
      local_size: collatedTranslatedSize,
      ...getSell({
        ...sellContext,
        offer,
      }),
    };
  }

  useEffect(() => {
    setListPrice(edit ? price : price || getSuggestedListPrice(highestOfferPrice, lowestListPrice));
    // eslint-disable-next-line
  }, [sell.size, price]);

  return {
    listPrice,
    setListPrice,
    expiration,
    setExpiration,
    sell,
  };
};

export default useSellContextValue;
