import useAuthStore from "../store/useAuthStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const discount = 0;
export const pageSize = 6;
export const orderStatus = [
  "Pending",
  "PaymentReceived",
  "PaymentFailed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// general API
export async function generalClientApi(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (response.status === 403) {
    throw new Error("Forbidden - You don't have permission");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// product api
export async function getProducts(filters = {}, pageSize, currentPage) {
  const params = new URLSearchParams();
  if (filters.searchTerm) params.append("search", filters.searchTerm);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.brands?.length) params.append("brands", filters.brands.join(","));
  if (filters.types?.length) params.append("types", filters.types.join(","));
  if (pageSize) params.append("pageSize", pageSize);
  if (currentPage) params.append("currentPage", currentPage);

  return generalClientApi(`${BASE_URL}/products?${params.toString()}`);
}

export async function getProduct(id) {
  return generalClientApi(`${BASE_URL}/products/${id}`);
}

// auth api
export async function loginUser(data) {
  return generalClientApi(`${BASE_URL}/Account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function registerUser(data) {
  return generalClientApi(`${BASE_URL}/Account/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// basket api
export async function getBasket() {
  return generalClientApi(`${BASE_URL}/basket`, {
    credentials: "include",
  });
}

export async function addBasketItem({ productId, quantity = 1 }) {
  return generalClientApi(
    `${BASE_URL}/basket/add?productId=${productId}&quantity=${quantity}`,
    {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
  );
}

// buy again
export async function buyAgain(orderId) {
  return generalClientApi(`${BASE_URL}/basket/buy-again/${orderId}`, {
    credentials: "include",
    method: "POST",
  });
}

export async function decreaseBasketItem({ productId }) {
  const url = `${BASE_URL}/basket/reduce?productId=${productId}`;
  return generalClientApi(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
  });
}

export async function removeBasketItem({ productId }) {
  return generalClientApi(`${BASE_URL}/basket/remove?productId=${productId}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
  });
}

export async function clearBasket() {
  const result = await generalClientApi(`${BASE_URL}/basket/clear`, {
    credentials: "include",
    method: "DELETE",
  });
  document.cookie =
    "basketPublicId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  return result;
}

// order api
export async function createPaymentIntent() {
  const token = useAuthStore.getState().token;
  return generalClientApi(`${BASE_URL}/payments`, {
    credentials: "include",
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchOrders() {
  const token = useAuthStore.getState().token;
  return generalClientApi(`${BASE_URL}/orders`, {
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchOrderDetailed(id) {
  const token = useAuthStore.getState().token;
  return generalClientApi(`${BASE_URL}/orders/${id}`, {
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  });
}
