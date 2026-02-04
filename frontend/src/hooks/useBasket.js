import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBasketItem,
  buyAgain,
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
      0,
    ) || 0;

  const deliveryFee = subTotalPrice >= 50000 ? 0 : 500;

  // add item to basket, create basket if not exist
  const addBasketItemMutation = useMutation({
    mutationFn: addBasketItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["basket"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // buy again mutations
  const buyAgainMutation = useMutation({
    mutationFn: buyAgain,
    onSuccess: () => {
      queryClient.invalidateQueries(["basket"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const decreaseBasketItemMutation = useMutation({
    mutationFn: decreaseBasketItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["basket"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeBasketItemMutation = useMutation({
    mutationFn: removeBasketItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["basket"]);
      toast.success("Successfully removed product!");
    },
    onError: (error) => {
      toast.error(error.message);
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
    buyAgainMutation,
    decreaseBasketItemMutation,
    removeBasketItemMutation,
  };
}
