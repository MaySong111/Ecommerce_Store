import { Grid2, Typography } from "@mui/material";
import OrderSummary from "../components/OrderSummary";
import CheckoutStepper from "../components/CheckoutStepper";
import { Elements } from "@stripe/react-stripe-js";
import {useOrder} from "../hooks/useOrder";
import { useState } from "react";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

// 1.create stripe instance
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const { createPaymentIntentMutation } = useOrder(setClientSecret);
 
  useEffect(() => {
    createPaymentIntentMutation.mutate();
  }, []);

  if (!clientSecret)
    return <Typography variant="h5">Loading checkout...</Typography>;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={8}>
        {!clientSecret || !stripePromise ? (
          <Typography variant="h6">Loading checkout ...</Typography>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutStepper />
          </Elements>
        )}
      </Grid2>

      <Grid2 size={4}>
        <OrderSummary />
      </Grid2>
    </Grid2>
  );
}
