import { ProductType } from 'types/resources/product';

import React from 'react';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { useStoreState } from 'app/store';
import { toDate } from 'common/utils/time';
import List from 'app/components/blocks/List';

const ProductSpecificationsList = ({ product }: { product: ProductType }) => {
  const currentCountryShortCode = useStoreState((s) => s.country.current.shortcode);
  const items = [
    { label: i18n._(t`AUTHENTIC`), value: i18n._(t`100% Certified`) },
    { label: i18n._(t`CONDITION`), value: i18n._(t`Brand New`) },
    { label: i18n._(t`SKU`), value: product.sku },
    { label: i18n._(t`BRAND`), value: product.main_brand },
    { label: i18n._(t`COLLAB`), value: product.sub_brand },
    {
      label: i18n._(t`RELEASE DATE`),
      value: [
        product.drop_date && `${toDate(product.drop_date, 'product')} (US)`,
        product.drop_dates_local?.[currentCountryShortCode] &&
          `${toDate(
            product.drop_dates_local[currentCountryShortCode],
            'product'
          )} (${currentCountryShortCode})`,
      ],
    },
    { label: i18n._(t`CATEGORY`), value: product.category },
    // { label: i18n._(t`CELEBRITY`), value: getCelebrityName(product.celebrity) },
  ];
  const sneakerExtras = [
    { label: i18n._(t`SILHOUETTE`), value: product.silhouette },
    { label: i18n._(t`MAIN COLOUR`), value: product.main_color },
    { label: i18n._(t`COLOURWAY`), value: product.colorway },
    { label: i18n._(t`UPPER`), value: product.upper_material },
    { label: i18n._(t`MIDSOLE`), value: product.midsole },
    { label: i18n._(t`NICKNAME`), value: product.nickname_english },
    { label: i18n._(t`DESIGNER`), value: product.designer },
  ];
  const apparelExtras = [{ label: i18n._(t`Season`), value: product.season }];
  const extraItems = product.class === 'Sneakers' ? sneakerExtras : apparelExtras;

  return <List items={items} extraItems={extraItems} />;
};

export default ProductSpecificationsList;
