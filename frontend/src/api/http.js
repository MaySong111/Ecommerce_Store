// import useAuthStore from "./store/useAuthStore";

export const BASE_URL = "https://localhost:7207/api";

// function getAuthHeaders() {
//   const token = useAuthStore.getState().token;
//   return {
//     "Content-Type": "application/json",
//     Authorization: token ? `Bearer ${token}` : "",
//   };
// }

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

// export async function deleteActivity(id) {
//   var result = await fetch(`${BASE_URL}/activities/${id}`, {
//     headers: getAuthHeaders(),
//     method: "DELETE",
//   });
//   return await result.json();
// }

// export async function loginUser(data) {
//   var response = await fetch(`${BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: getAuthHeaders(),
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     throw new Error("Login failed");
//   }
//   if (response.status === 401) {
//     // Token 过期或无效，清除并跳转到登录页
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   }
//   return response.json();
// }

// export async function registerUser(data) {
//   var response = await fetch(`${BASE_URL}/auth/register`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     throw new Error("Registration failed");
//   }
//   return response.json();
// }

// export async function getUserInfo() {
//   const response = await fetch(`${BASE_URL}/auth/me`, {
//     headers: {
//       "content-type": "application/json",
//     },
//   });
//   if (!response.ok) {
//     throw new Error("Failed to fetch user info");
//   }
//   const user = await response.json();
//   return user;
// }
