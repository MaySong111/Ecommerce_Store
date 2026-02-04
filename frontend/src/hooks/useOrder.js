import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createPaymentIntent,
  fetchOrderDetailed,
  fetchOrders,
} from "../api/http";

export function useOrder(setClientSecret) {
  const createPaymentIntentMutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: (data) => {
      // receive client secret from the server and set it in state
      setClientSecret(data.clientSecret);
    },
  });
  return { createPaymentIntentMutation };
}

// fetch all orders for the user
export function useFetchOrdersQuery() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
}

// fetch detailed info for a specific order by id
export function useFetchOrderDetailedQuery(id) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => fetchOrderDetailed(id),
    enabled: !!id,
  });
}

