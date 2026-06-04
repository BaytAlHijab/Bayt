import { useEffect, useState } from "react";
import { IconWa, IconX } from "./Icons";
import { buildWaUrl } from "../utils/whatsapp";
import { getProductImage } from "../utils/productImages";

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setImgIdx(0);
    setQty(1);
  }, [product?.id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  const hasImages = product.images && product.images.length > 0;
  const totalImages = hasImages ? product.images.length : 1;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <IconX />
        </button>
        <div className="modal-body">
          <div className="modal-gallery">
            <div className="modal-main-img">
              {hasImages ? (
                <img
                  src={getProductImage(product.images[imgIdx])}
                  alt={`${product.name} photo ${imgIdx + 1}`}
                />
              ) : (
                <span style={{ fontSize: 80 }}>{product.emoji}</span>
              )}
            </div>
            {totalImages > 1 && (
              <div className="modal-thumbs">
                {product.images.map((imgKey, i) => (
                  <div
                    key={i}
                    className={`modal-thumb${imgIdx === i ? " active" : ""}`}
                    onClick={() => setImgIdx(i)}
                  >
                    <img src={getProductImage(imgKey)} alt={`thumb ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-info">
            <span className="modal-badge">{product.category}</span>
            <h2 className="modal-name">{product.name}</h2>
            <p className="modal-sub">{product.sub}</p>
            <div className="modal-price">₹{product.price.toLocaleString()}</div>
            <p className="modal-desc">{product.description}</p>

            <div className="qty-row">
              <span className="qty-label">Qty:</span>
              <div className="qty-ctrl">
                <button
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="qty-num">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-modal-cart"
                onClick={() => {
                  onAddToCart(product, qty);
                  onClose();
                }}
              >
                Add to cart
              </button>
              <button
                className="btn-modal-wa"
                onClick={() => {
                  const msg = `Hi! I'd like to order:\n\n*${product.name}*\nQty: ${qty}\nPrice: ₹${product.price} × ${qty} = ₹${product.price * qty}\n\nPlease confirm availability.`;
                  window.open(buildWaUrl(msg), "_blank");
                }}
              >
                <IconWa /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
