import { OfferListType } from 'types/resources/offerList';
import { ProductClassType, ProductType } from 'types/resources/product';

import { useEffect, useState } from 'react';

import API from 'common/api';
import { getHighLowOfferList, HighLowOfferListsType } from 'common/utils/offerLists';
import { PaymentMethodEnumType } from 'types/resources/paymentMethod';
import { TrxnDeliverToType } from 'types/resources/transaction';
import { getBuy, getOffer, getSuggestedOfferPrice } from 'common/utils/buy';
import { defaultPromocode, PromocodeType } from 'types/resources/promocode';
import { useStoreState } from 'app/store';

import { defaultProductAddOn, ProductAddOnType } from 'types/resources/productAddOn';
import { useQuery } from 'react-query';
import { ProductCheckoutContextType } from '../context';

const useProductAddOn = ({
  product_class,
  deliverTo,
  currencyId,
  countryId,
}: {
  product_class: ProductClassType;
  deliverTo: TrxnDeliverToType;
  currencyId: number;
  countryId: number;
}) => {
  const { data: productAddOns } = useQuery<ProductAddOnType[]>(
    [
      `product_add_ons/class/${product_class}`,
      { modifier: { currency_id: currencyId, country_id: countryId } },
    ],
    { initialData: [defaultProductAddOn], enabled: !!product_class }
  );
  const [_quantity, setQuantity] = useState<number>(0);
  const addOn: ProductAddOnType | null = Array.isArray(productAddOns) ? productAddOns[0] : null;

  // Add-On can't apply on storage
  const quantity = deliverTo === 'storage' ? 0 : _quantity;
  if (!addOn) return { addOn: null, price: 0, quantity: 0, setQuantity };

  const price = quantity * addOn.price;

  return { addOn, price, quantity, setQuantity };
};
const useBuyContextValue = ({
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
}): ProductCheckoutContextType['buy'] => {
  const user = useStoreState((s) => s.user.user);
  const currencyId = useStoreState((s) => s.currency.current.id);
  const countryId = Number(useStoreState((s) => s.country.current.id));

  const { offer_list_id, edit, size, price, expiration: offerExpiration } = params;
  const [offerPrice, setOfferPrice] = useState<number>();
  const [expiration, setExpiration] = useState<number>(offerExpiration || 30);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnumType>('stripe');
  const [deliverTo, setDeliveryTo] = useState<TrxnDeliverToType>('buyer');
  const [promocode, setPromocode] = useState<PromocodeType>(defaultPromocode);
  const [applicablePromocodes, setApplicablePromocodes] = useState<PromocodeType[]>([]);
  const [deliveryDeclare, setDeliveryDeclare] = useState<number>(0);
  const { highestOfferPrice, lowestListPrice } = getHighLowOfferList(highLowOfferLists, size);

  const productAddOn = useProductAddOn({
    product_class: product.class,
    deliverTo,
    currencyId,
    countryId,
  });
  const buyContext = {
    product,
    promocode,
    user,
    deliverTo,
    deliveryDeclare,
    paymentMethod,
  };
  let buy: OfferListType;
  if (offer_list_id === 'offer' || edit) {
    const list = { size, local_price: offerPrice, expiration, id: offer_list_id };
    const { collatedTranslatedSize } = getDisplaySize(size);
    buy = {
      local_size: collatedTranslatedSize,
      ...getOffer({ ...buyContext, list }),
      isEdit: edit,
    };
  } else {
    const list = offerLists.find((o) => o.id === offer_list_id) || { size };
    const { collatedTranslatedSize } = getDisplaySize(list?.size || '');
    // @ts-ignore ignore
    buy = {
      local_size: collatedTranslatedSize,
      ...getBuy({
        ...buyContext,
        list,
        productAddOn,
      }),
    };
  }

  useEffect(() => {
    setOfferPrice(
      edit ? price : price || getSuggestedOfferPrice(highestOfferPrice, lowestListPrice)
    );
    setDeliveryDeclare(0);
    setDeliveryTo('buyer');
    // eslint-disable-next-line
  }, [buy.size, price]);

  const buyPrice = buy.isOffer ? buy.local_price : buy.price + buy.fees.deliveryInstant;

  const fetchApplicablePromocodes = (setDefaultPromo = false) =>
    buyPrice > 0 &&
    API.post<{
      defaultPromoCode: PromocodeType & { discount: number };
      promocodes: PromocodeType[];
    }>(`promocodes/${buy.isOffer ? 'offer' : 'buy'}`, {
      buyPrice,
      currency_id: currencyId,
      delivery: buy.fees.deliveryFeeRegular,
      product_id: product.id,
    })
      .then(({ defaultPromoCode, promocodes }) => {
        if (setDefaultPromo) {
          if (defaultPromoCode) {
            setPromocode({ ...defaultPromoCode, value: defaultPromoCode.discount || 0 });
          } else {
            setPromocode(defaultPromocode);
          }
        }
        setApplicablePromocodes(promocodes);
      })
      .catch(() => setApplicablePromocodes([]));

  const verifyPromocode = (code: string) =>
    API.post<PromocodeType>(`promocodes/verify/${buy.isOffer ? 'offer' : 'buy'}`, {
      code,
      buyPrice,
      currency_id: currencyId,
      delivery: buy.fees.deliveryFeeRegular,
      product: { id: product.id },
      payment_method: buy.payment_method,
    }).then((data) => {
      setPromocode(data);
      return data;
    });

  return {
    offerPrice,
    setOfferPrice,
    expiration,
    setExpiration,
    paymentMethod,
    setPaymentMethod,
    promocode: {
      currentPromocode: promocode,
      setCurrentPromocode: setPromocode,
      applicablePromocodes,
      setApplicablePromocodes,
      fetchApplicablePromocodes,
      verifyPromocode,
    },
    productAddOn,
    deliverTo,
    setDeliveryTo,
    deliveryDeclare,
    setDeliveryDeclare,
    buy,
  };
};

export default useBuyContextValue;
