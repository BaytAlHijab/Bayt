import ProductImage from "./ProductImage";
import { buildWaUrl } from "../utils/whatsapp";
import { Plus } from "lucide-react";

export default function ProductCard({ product, onOpen, onAddToCart }) {
  return (
    <div className="prod-card" onClick={() => onOpen(product)}>
      <div className="prod-img-wrap">
        <ProductImage product={product} />
        {product.images && product.images.length > 1 && (
          <span className="prod-img-count">
            +{product.images.length} photos
          </span>
        )}
      </div>
      <div className="prod-body">
        <div className="prod-name">{product.name}</div>
        <div className="prod-sub">{product.sub}</div>
        <div className="prod-footer">
          <span className="prod-price">₹{product.price.toLocaleString()}</span>
          <div className="prod-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-buy-now"
              onClick={() => {
                const msg = `Hi Bayt Al Hijab! I'm interested in the following product:\n\n*${product.name}*\nPrice: ₹${product.price}\n\nPlease share availability.`;
                window.open(buildWaUrl(msg), "_blank");
              }}
            >
              Buy now
            </button>
            <button
              className="btn-add-cart"
              title="Add to cart"
              onClick={() => onAddToCart(product)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
