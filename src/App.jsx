import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import { IconCart, IconMenu } from "./components/Icons";
import TestimonialsScroller from "./components/TestimonialScroller";
import { CATEGORIES, TESTIMONIALS } from "./data/constants";
import { PRODUCTS } from "./data/products";
import { buildWaUrl } from "./utils/whatsapp";
import Logo from "./assets/Logo.jpeg";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalProduct, setModalProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  const handleNavClick = (section) => {
    scrollTo(section);
    setMenuOpen(false);
  };

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 1800);
  };

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item,
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const changeQty = (id, qty) =>
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item)),
    );
  const removeItem = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  useEffect(() => {
    document.body.style.overflow = modalProduct || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalProduct, cartOpen]);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <nav className="navbar">
        <div
          className="navbar-logo"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setMenuOpen(false);
          }}
        >
          <div className="logo-mark">
            <img src={Logo} alt="Bayt Al Hijab Logo" height={50} width={50} />
          </div>
          <span className="brand-name">Bayt Al Hijab</span>
        </div>

        <div className="navbar-actions">
          <nav className="nav-links">
            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("shop");
              }}
            >
              Shop
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("about");
              }}
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("contact");
              }}
            >
              Contact
            </a>
          </nav>

          <button
            className="cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${cartCount} items`}
          >
            <IconCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            className="hamburger"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <IconMenu />
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("shop");
                setMenuOpen(false);
              }}
            >
              Shop
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("about");
                setMenuOpen(false);
              }}
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("contact");
                setMenuOpen(false);
              }}
            >
              Contact
            </a>
          </div>
        )}
      </nav>

      <section className="hero">
        {/* The orbs can be updated in CSS to match your logo's burgundy and cream palette */}
        <div className="hero-orb1" />
        <div className="hero-orb2" />

        <h1>Bayt Al Hijab</h1>

        <h3>
          Here Modesty Meets <em>Perfection.</em>
        </h3>

        <p>
          A Crown of Modesty, Worn For The Sake of Allah.
          <br />
          Premium wear crafted with care for every style.
        </p>

        <div className="hero-btns">
          <button className="btn-primary" onClick={() => scrollTo("shop")}>
            Shop now
          </button>
          <button className="btn-outline" onClick={() => scrollTo("about")}>
            Our story
          </button>
        </div>

        <div className="hero-strip">
          <div className="strip-item">
            <strong>100+</strong>
            <span>styles</span>
          </div>

          <div className="strip-item">
            <strong>1000+</strong>
            <span>Customers</span>
          </div>
          <div className="strip-item">
            <strong>1</strong>
            <span>Mission</span>
          </div>
        </div>
      </section>

      <section id="shop" className="section-wrap">
        <div className="section-header">
          <h2 className="section-title">Shop the collection</h2>
        </div>

        <div
          className="cats-scroll"
          role="tablist"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-pill${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={setModalProduct}
              onAddToCart={(product) => {
                addToCart(product);
                showToast(`${product.name} added to cart`);
              }}
            />
          ))}
        </div>
      </section>

      <div className="section-wrap" style={{ paddingTop: 0 }}>
        <div className="promo-banner">
          <div className="promo-text">
            <h3>Eid Sale is live</h3>
            <p>Up to 10% off select styles</p>
          </div>
          <button
            className="btn-promo"
            onClick={() => {
              setActiveCategory("All");
              scrollTo("shop");
            }}
          >
            Explore collection
          </button>
        </div>
      </div>

      <section id="about" className="about-section">
        <div className="about-inner">
          <span className="about-tag">Our Story</span>
          <h2>
            Born from faith,
            <br />
            <em>crafted with love.</em>
          </h2>
          <p>
            Bayt Al Hijab was born in the heart of KanyaKumari a small family
            endeavour with one simple belief: every woman deserves modest wear
            that is both beautiful and effortless.
          </p>
          <p>
            We source our fabrics with care, work closely with skilled artisans,
            and design every piece with the modern Muslim woman in mind. Whether
            it's a quiet morning or a festive celebration, we want you to feel
            graceful and at home in what you wear.
          </p>
          <div className="about-values">
            <div className="about-val">
              <strong>2026</strong>
              <span>Founded</span>
            </div>
            <div className="about-val">
              <strong>100+</strong>
              <span>Styles</span>
            </div>
            <div className="about-val">
              <strong>1,000+</strong>
              <span>Happy customers</span>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsScroller testimonials={TESTIMONIALS} />

      <footer id="contact" className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand">Bayt Al Hijab</div>
              <p className="footer-tagline">Elegance in every fold.</p>
            </div>
            <div className="footer-links-group">
              <h4>Shop</h4>
              <a
                href="#shop"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("All");
                }}
              >
                All products
              </a>
              <a
                href="#shop"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCategory("All");
                  scrollTo("shop");
                }}
              >
                Hijabs
              </a>
              <a
                href="#shop"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCategory("Hampers");
                  scrollTo("shop");
                }}
              >
                Custom Gifts
              </a>
            </div>
            <div className="footer-links-group">
              <h4>Info</h4>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("about");
                }}
              >
                About us
              </a>
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    buildWaUrl("Hi! I have a question about Bayt Al Hijab."),
                    "_blank",
                  );
                }}
              >
                Contact us
              </a>
              <a
                href="https://www.instagram.com/bayt.al.hijab_?igsh=MTZjdnllM2JmZHVnMw=="
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            © 2026 Bayt Al Hijab. All rights reserved.
          </div>
        </div>
      </footer>

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={addToCart}
        />
      )}
      {toast && <div className="toast">✓ {toast}</div>}
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onQtyChange={changeQty}
          onRemove={removeItem}
        />
      )}
    </>
  );
}
