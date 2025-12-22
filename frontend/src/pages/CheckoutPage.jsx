import { Grid2 } from "@mui/material";
import OrderSummary from "../components/OrderSummary";
import CheckoutStepper from "../components/CheckoutStepper";
import { Elements } from "@stripe/react-stripe-js";
import useOrder from "../hooks/useOrder";
import { useState } from "react";
import { useEffect } from "react";
import { stripePromise } from "../api/http";

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState(null);
  const mutation = useOrder(setClientSecret);

  useEffect(() => {
    mutation.mutate();
  }, []);

  if (!clientSecret) return null;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={8}>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutStepper />
        </Elements>
      </Grid2>

      <Grid2 size={4}>
        <OrderSummary />
      </Grid2>
    </Grid2>
  );
}
