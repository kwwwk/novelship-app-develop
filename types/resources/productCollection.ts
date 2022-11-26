import { BaseType } from './base';

export interface ProductCollectionType extends BaseType {
  name: string;
  slug: string;
  tag_color: string;
  tag_styling: 'primary' | 'secondary';
  category: 'Sneakers' | 'Apparel';
  countries: string[];
}
