// export const BASE_URL = "https://localhost:7207/api";
export const BASE_URL = "http://localhost:5207/api";

// product api--------------------------------------------------------------

export async function getProducts() {
  var result = await fetch(`${BASE_URL}/products`);
  return result.json();
}

export async function getProduct(id) {
  var result = await fetch(`${BASE_URL}/products/${id}`);
  return result.json();
}

export async function createProduct(product) {
  var response = await fetch(`${BASE_URL}/products`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(product),
  });

  if (response.status === 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  return response.json();
}

export async function updateProduct(id, product) {
  var result = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  if (!result.ok) {
    throw new Error("Update failed");
  }
  return result.json();
}

//  auth api--------------------------------------------------------------

export async function loginUser(data) {
  var response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  if (response.status === 401) {
    // Token 过期或无效，清除并跳转到登录页
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  return response.json();
}

export async function registerUser(data) {
  var response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  return response.json();
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
