import { defaultProductAddOn, ProductAddOnType } from 'types/resources/productAddOn';

const getMax = (a: number, b: number) => (a > b ? a : b);

const productGetEffectiveWeight = (
  product: { actual_weight: number; vol_weight: number } = {
    actual_weight: 0,
    vol_weight: 0,
  },
  { addOn, quantity }: { addOn: ProductAddOnType | null; quantity: number } = {
    addOn: defaultProductAddOn,
    quantity: 0,
  }
) => {
  const weight = getMax(
    product.vol_weight + ((addOn?.volume_weight || 0) * quantity || 0),
    product.actual_weight + ((addOn?.actual_weight || 0) * quantity || 0)
  );
  const roundTo = weight < 5000 ? 500 : 1000;

  return Math.ceil(weight / roundTo) * roundTo;
};

export { productGetEffectiveWeight };
