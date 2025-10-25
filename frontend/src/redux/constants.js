export const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "" // same-origin when served from backend
    : "http://localhost:8000");

// Helper: safely construct URLs for images or assets
export const getImageUrl = (path = "") => {
  if (!path) return "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
};

export const USERS_URL = "/api/users";
export const CATEGORY_URL = "/api/category";
export const PRODUCT_URL = "/api/products";
export const UPLOAD_URL = "/api/upload";
export const ORDERS_URL = "/api/orders";
export const ESEWA_URL = "/api/esewa";
