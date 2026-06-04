import { IconWa, IconX } from "./Icons";
import { buildWaUrl } from "../utils/whatsapp";
import { Plus, Minus, Trash2 } from "lucide-react";
import { getProductImage } from "../utils/productImages";

export default function CartDrawer({ items, onClose, onQtyChange, onRemove }) {
  const numericTotal = items.reduce((sum, item) => {
    return typeof item.price === "number" ? sum + item.price * item.qty : sum;
  }, 0);

  const hasCustomItems = items.some((item) => typeof item.price !== "number");

  const handleBuyAll = () => {
    const lines = items
      .map((i) => {
        const itemPrice =
          typeof i.price === "number"
            ? `₹${(i.price * i.qty).toLocaleString()}`
            : "Custom Pricing";

        return `• ${i.name} × ${i.qty} = ${itemPrice}`;
      })
      .join("\n");
    const msg = `Hi! I'd like to order the following:\n\n${lines}\n\n*Total: ${
      hasCustomItems
        ? `₹${numericTotal.toLocaleString()} + Custom`
        : `₹${numericTotal.toLocaleString()}`
    }*\n\nPlease confirm availability.`;
    window.open(buildWaUrl(msg), "_blank");
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
      >
        <div className="cart-header">
          <span className="cart-title">Your Cart</span>
          <button
            className="cart-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            <IconX />
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛍️</div>
              <p>
                Your cart is empty.
                <br />
                Add some beautiful pieces!
              </p>
            </div>
          ) : (
            items.map((item) => {
              const imageKey = item.images?.[0];
              const imageUrl = imageKey ? getProductImage(imageKey) : "";

              return (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-img">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.name} />
                    ) : (
                      item.emoji
                    )}
                  </div>

                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-sub">{item.sub}</div>
                    <div className="cart-item-qty">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          onQtyChange(item.id, Math.max(1, item.qty - 1))
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-num">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onQtyChange(item.id, item.qty + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 6,
                    }}
                  >
                    <span className="prod-price">
                      {typeof item.price === "number"
                        ? `₹${(item.price * item.qty).toLocaleString()}`
                        : "Custom"}
                    </span>
                    <button
                      className="cart-remove"
                      onClick={() => onRemove(item.id)}
                      aria-label="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span className="cart-total-label">Total</span>
            <span className="prod-price">
              {hasCustomItems
                ? `₹${numericTotal.toLocaleString()} + Custom`
                : `₹${numericTotal.toLocaleString()}`}
            </span>
          </div>
          <button
            className="btn-cart-wa"
            onClick={handleBuyAll}
            disabled={items.length === 0}
          >
            <IconWa /> Order all on WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
