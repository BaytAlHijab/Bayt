import { getProductImage } from "../utils/productImages";

export default function ProductImage({ product, index = 0, style }) {
  const imageKey = product.images?.[index];

  if (imageKey) {
    const imageUrl = getProductImage(imageKey);
    return <img src={imageUrl} alt={product.name} style={style} />;
  }

  return <div className="prod-img-placeholder">{product.emoji}</div>;
}
