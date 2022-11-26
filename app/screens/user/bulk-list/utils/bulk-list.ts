import { BulkListEditType } from 'app/screens/user/bulk-list/context';
import { OfferListType } from 'types/resources/offerList';
import { toList } from 'common/utils/list';

const getNewListPrice = (
  list: OfferListType,
  editByValue: number,
  editOption: BulkListEditType
) => {
  let newListPrice = list.local_price;

  if (editOption === 'increaseByValue') {
    newListPrice = list.local_price + editByValue;
  }
  if (editOption === 'decreaseByValue') {
    newListPrice = list.local_price - editByValue;
  }
  if (editOption === 'beatLowestListByValue') {
    newListPrice = getLowestListPrice(list) - editByValue;
  }
  if (editOption === 'setToValue') {
    newListPrice = editByValue;
  }

  return newListPrice;
};

const getLowestListPrice = (list: OfferListType) =>
  toList(list.product_stat?.lowest_list_price || 0);

const checkIfInvalidLists = (
  currentlyListed: OfferListType[],
  editByValue: number,
  editOption: BulkListEditType
) =>
  currentlyListed.some(
    (list) => getNewListPrice(list, editByValue, editOption) < list.currency.min_list_price
  );

export default { getNewListPrice, getLowestListPrice, checkIfInvalidLists };
