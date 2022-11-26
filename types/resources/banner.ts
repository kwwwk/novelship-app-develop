import { BaseType } from './base';

export interface BannerType extends BaseType {
  title: string;
  image: string;
  url: string;
  carousel_sequence: number;

  page: 'home' | 'search' | 'browse';
  main_category: 'all' | 'sneakers' | 'apparel' | 'collectibles';
  banner_type: 'carousel' | 'masthead';

  device: 'desktop' | 'mobile';
  language: 'en' | 'id' | 'my' | 'zh-cmn-Hans';
  countries: string[];

  start_at: string | Date;
  end_at: string | Date;
}
