// src/utils/productImages.js
const modules = import.meta.glob(
  "../assets/products/**/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
);

const normalizePath = (path) =>
  path
    .replace("../assets/products/", "")
    .replace(/\.(jpg|jpeg|png|webp)$/i, "");

const imageMap = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => [normalizePath(path), url]),
);

export const getProductImage = (key) => imageMap[key] || "";
