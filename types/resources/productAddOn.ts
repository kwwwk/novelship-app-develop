import { BaseType } from './base';

export interface ProductAddOnType extends BaseType {
  name: string;
  image: string;
  sku: string;
  main_brand: string;
  sizes: string[];
  actual_weight: number;
  volume_weight: number;
  dimensions: number[];
  product_category: string;
  hs_code: string;
  description: string;
  // Inventory
  country_code: string;
  currency: string;
  price: number;
  stock: number;
}
const defaultProductAddOn: ProductAddOnType = {
  id: 0,
  actual_weight: 0,
  image: '',
  main_brand: '',
  name: '',
  sku: '',
  dimensions: [],
  hs_code: '',
  description: '',
  product_category: '',
  sizes: [],
  country_code: '',
  currency: '',
  price: 0,
  stock: 0,
  volume_weight: 0,
};
export { defaultProductAddOn };
