import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBasketItem,
  clearBasket,
  decreaseBasketItem,
  getBasket,
  removeBasketItem,
} from "../api/http";
import toast from "react-hot-toast";

export default function useBasket() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["basket"],
    queryFn: () => getBasket(),
  });
  // calculate total count from basket items
  const totalCount =
    data?.basket?.basketItems?.reduce((sum, item) => sum + item.quantity, 0) ||
    0;

  const subTotalPrice =
    data?.basket?.basketItems?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;

  const deliveryFee = subTotalPrice > 20000 ? 0 : 500;

  const addBasketItemMutation = useMutation({
    mutationFn: (item) => addBasketItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries(["basket"]);
    },
    onError: (error) => {
      // console.error("Error adding product:", error);
      toast.error(error.message);
    },
  });

  const decreaseBasketItemMutation = useMutation({
    mutationFn: (item) => decreaseBasketItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries(["basket"]);
    },
    onError: (error) => {
      console.error("Error decreasing product:", error);
      toast.error("Failed to decrease product.");
    },
  });

  const removeBasketItemMutation = useMutation({
    mutationFn: (item) => removeBasketItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries(["basket"]);
      toast.success("Successfully removed product!");
    },
    onError: (error) => {
      console.error("Error removing product:", error);
      toast.error("Failed to remove product.");
    },
  });

  const clearBasketMutation = useMutation({
    mutationFn: () => clearBasket(),
    onSuccess: () => {
      queryClient.invalidateQueries(["basket"]);
    },
  });

  return {
    basket: data?.basket,
    isLoading,
    totalCount,
    subTotalPrice,
    deliveryFee,
    totalPrice: subTotalPrice + deliveryFee,
    addBasketItemMutation,
    decreaseBasketItemMutation,
    removeBasketItemMutation,
    clearBasketMutation,
  };
}
