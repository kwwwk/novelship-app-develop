import { ProductType, SneakerSizeMapType } from 'types/resources/product';

import { useQuery } from 'react-query';
import { useStoreState } from 'app/store';
import { brandMap, genderMap } from 'common/constants/size';

const useProductSizes = (product: ProductType) => {
  const user = useStoreState((s) => s.user.user);

  const _brand = brandMap[product.main_brand] || product.main_brand;

  const { data: sizeMappings = [] } = useQuery<SneakerSizeMapType[]>(
    [`sneaker-sizes/${product.size_specific || _brand}/${product.gender}`],
    {
      initialData: [],
      enabled: !!(product.id && product.is_sneaker),
    }
  );

  // size mappings
  const derivedSizeUnit =
    product.is_sneaker && product.sizes[0] && product.sizes[0].match(/(US|JP|EU|UK)/);
  const productSizeUnit = product.is_sneaker ? (derivedSizeUnit ? derivedSizeUnit[0] : 'US') : '';

  const {
    unit: shoeSizeUnit = productSizeUnit,
    category: shoeSizeGender,
    size: shoeSize,
    brand: shoeBrand = _brand,
    eu_size: shoeEUSize,
    us_size: shoeUSSize,
  } = user.size_preferences.Sneakers || {};

  const _shoeBrand = brandMap[shoeBrand] || shoeBrand;

  // handling size mapping from men to women and vice versa
  const displayUnit =
    shoeSizeUnit === 'US'
      ? product.gender === 'men' && shoeSizeGender === 'women'
        ? 'US_W'
        : product.gender === 'women' && shoeSizeGender === 'men'
        ? 'US_M'
        : 'US'
      : shoeSizeUnit;

  const sizeMap = productSizeUnit
    ? sizeMappings.reduce((prev: Record<string, SneakerSizeMapType>, curr: SneakerSizeMapType) => {
        const productSizeName = `${productSizeUnit} ${curr[productSizeUnit]}`;

        prev[productSizeName] = {
          ...curr,
          displaySize: curr[displayUnit] ? `${shoeSizeUnit} ${curr[displayUnit]}` : '',
        };
        return prev;
      }, {})
    : {};

  // handling automated size selection, cross brands/gender for sneakers
  const mapUsingUSSize = (genderMap[product.gender] || product.gender) === shoeSizeGender;
  const preferredSizeMap = Object.entries(sizeMap).find(([, s]) =>
    _shoeBrand === _brand
      ? `${s[displayUnit]}` === shoeSize
      : `${mapUsingUSSize ? s.US : s.EU_R || s.EU}` === (mapUsingUSSize ? shoeUSSize : shoeEUSize)
  );

  const preferredSize = product.is_one_size
    ? 'OS'
    : product.is_apparel
    ? user.size_preferences.Apparel?.size
    : preferredSizeMap
    ? preferredSizeMap[0]
    : undefined;

  const getDisplaySize = (size: string) => {
    const localSize = sizeMap[size]?.displaySize !== size ? sizeMap[size]?.displaySize : '';
    const defaultSize =
      derivedSizeUnit && productSizeUnit === 'US' && product.gender === 'men' ? `${size}M` : size;

    const displaySize = localSize || defaultSize;
    const collatedTranslatedSize = localSize ? `${localSize} (${defaultSize})` : defaultSize;

    return { displaySize, collatedTranslatedSize, defaultSize };
  };

  return { map: sizeMap, getDisplaySize, preferredSizeUnit: shoeSizeUnit, preferredSize };
};

export default useProductSizes;
