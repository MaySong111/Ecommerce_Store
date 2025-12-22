import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent } from "../api/http";

export default function useOrder(setClientSecret) {
  const mutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
  });
  return mutation;
}
