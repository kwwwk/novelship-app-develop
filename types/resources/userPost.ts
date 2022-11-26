import { BaseType } from './base';
import { UserType } from './user';
import { ProductType } from './product';

export interface UserPostType extends BaseType {
  id: number;
  user_id: number;
  product_id: number;
  reviewer_id: number;
  gallery: string[];
  tags: number[];
  title: string;
  user_name: string;
  user_avatar: string;
  status: 'draft' | 'pending' | 'confirmed' | 'rejected' | 'deleted';

  // Relational Data
  user?: UserType;
  reviewed_by?: UserType;
  product?: ProductType;
}

const defaultUserPost: UserPostType = {
  id: 0,
  user_id: 0,
  product_id: 0,
  reviewer_id: 0,
  gallery: [],
  tags: [],
  title: '',
  user_name: '',
  user_avatar: '',
  status: 'pending',
};

export { defaultUserPost };
