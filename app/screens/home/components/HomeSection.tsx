import React from 'react';

import { ScrollContainer } from 'app/components/layout';
import { BrowseParamType } from 'types/views/browse';
import { ProductType } from 'types/resources/product';
import { ProductCard } from 'app/components/product';
import { Box } from 'app/components/base';

import HomeSectionHeader from './HomeSectionHeader';

const HomeSection = ({ products, ...props }: HomeSectionProps) => (
  <Box mb={2}>
    <HomeSectionHeader ml={4} {...props} />
    <Box minHeight={210}>
      {products.length ? (
        <ScrollContainer horizontal>
          {products.map((p: ProductType, i: number) => (
            <Box key={p.id} mr={i === products.length - 1 ? 2 : 3} ml={i === 0 ? 2 : 0}>
              <ProductCard
                product={p}
                section={props.title}
                styleName="home"
                sort={props?.viewMoreParams?.sort}
              />
            </Box>
          ))}
        </ScrollContainer>
      ) : null}
    </Box>
  </Box>
);

export type HomeSectionProps = {
  title: string;
  subTitle?: string;
  products: ProductType[];
  viewMoreParams?: BrowseParamType;
  productCategory?: ProductType['class'];
  hintTitle?: string;
  hintText?: string;
};

export default HomeSection;
