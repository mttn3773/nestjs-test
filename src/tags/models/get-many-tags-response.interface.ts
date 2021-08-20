import { Tag } from './tag.entity';
export interface IGetManyTags {
  data: Tag[];
  meta: {
    offset: number;
    length: number;
    quantity: number;
  };
}
