import { BaseType } from './base';
import { ProductType } from './product';
import { UserPostType } from './userPost';

export interface UserPostProductTagType extends BaseType {
  id: number;
  product_id: number;
  user_post_id: number;

  // Relational Data
  user_post: UserPostType;
  product?: ProductType;
}
