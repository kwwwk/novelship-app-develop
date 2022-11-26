import { createContext } from 'react';

export type BulkListEditType =
  | 'increaseByValue'
  | 'decreaseByValue'
  | 'beatLowestListByValue'
  | 'setToValue';

export type BulkListContextType = {
  editOption: BulkListEditType;
  setEditOption: (v: BulkListEditType) => void;
  editByValue: number;
  setEditByValue: (u: number) => void;
  selectedListsId: number[];
  setSelectedListsId: (s: number[]) => void;
  expiration: number;
  setExpiration: (e: number) => void;
};

const defaultFn = () => {};

const BulkListContext = createContext<BulkListContextType>({
  editOption: 'beatLowestListByValue',
  setEditOption: defaultFn,
  editByValue: 0,
  setEditByValue: defaultFn,
  selectedListsId: [],
  setSelectedListsId: defaultFn,
  expiration: 30,
  setExpiration: defaultFn,
});

export default BulkListContext;
