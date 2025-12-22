// export const BASE_URL = "https://localhost:7207/api";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// constant
export const discount = 0;
export const pageSize = 6;

// product api--------------------------------------------------------------
// GET /api/products?search=boot&sortBy=price&brands=Angular,Core
export async function getProducts(filters = {}, pageSize, currentPage) {
  const params = new URLSearchParams();
  console.log("getProducts called with filters:", params.toString());

  if (filters.searchTerm) params.append("search", filters.searchTerm);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.brands?.length) params.append("brands", filters.brands.join(","));
  if (filters.types?.length) params.append("types", filters.types.join(","));
  if (pageSize) params.append("pageSize", pageSize);
  if (currentPage) params.append("pageNumber", currentPage);

  const url = `${BASE_URL}/products?${params.toString()}`;
  const response = await fetch(url);
  return response.json();
}

export async function getProduct(id) {
  var result = await fetch(`${BASE_URL}/products/${id}`);
  return result.json();
}

//  auth api--------------------------------------------------------------

export async function loginUser(data) {
  const url = `${BASE_URL}/Account/login`;
  var response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Login failed");
  }

  return responseData;
}

export async function registerUser(data) {
  const url = `${BASE_URL}/Account/register`;
  var response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Registration failed");
  }
  return responseData;
}

// basket api--------------------------------------------------------------

export async function getBasket() {
  var result = await fetch(`${BASE_URL}/basket`, {
    credentials: "include",
  });
  return result.json();
}

export async function addBasketItem({ productId }) {
  // console.log("addBasketItem called with:", productId);
  const url = `${BASE_URL}/basket?productId=${productId}`;
  console.log("addBasketItem url:", url);
  var response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const data = await response.json();
  // console.log("addBasketItem response data:", data);
  if (!response.ok) {
    throw new Error(data.message); // 抛出后端返回的错误信息
  }
  return data;
}

export async function decreaseBasketItem({ productId }) {
  // console.log("decreaseBasketItem called with:", productId);
  const url = `${BASE_URL}/basket/reduce?productId=${productId}`;
  // console.log("decreaseBasketItem url:", url);
  var response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });
  // console.log("decreaseBasketItem response:", response);
  if (!response.ok) {
    throw new Error("Failed to decrease item in basket");
  }
  return;
}

export async function removeBasketItem({ productId }) {
  var result = await fetch(`${BASE_URL}/basket/remove?productId=${productId}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });
  return await result.json();
}

// order api--------------------------------------------------------------
import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

//  frontend calls backend to create a payment intent with stripe
export async function createPaymentIntent() {
  const url = `${BASE_URL}/payments`;
  var response = await fetch(url, {
    credentials: "include",
    method: "POST",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
