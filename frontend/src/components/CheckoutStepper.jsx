import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import ReviewOrder from "./ReviewOrder";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const steps = ["Address", "Payment", "Review"];

export default function CheckoutStepper() {
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState(0);
  const [stripeAddress, setStripeAddress] = useState(null);
  const [saveAddressChecked, setSaveAddressChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const elements = useElements();
  const stripe = useStripe();

  const handleNext = async () => {
    if (activeStep === 0 && elements) {
      const addressElement = elements.getElement("address");
      const { complete, value } = await addressElement.getValue();

      if (!complete) {
        toast.error("Please complete the address form");
        return;
      }
      setStripeAddress(value);

      if (saveAddressChecked) {
        try {
          await fetch("http://localhost:5207/api/account/address", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(value),
          });
        } catch (error) {
          console.error("Failed to save address:", error);
        }
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // handle payment submission-stripe
  const handlePay = async () => {
    if (!stripe || !elements) return;
    setIsLoading(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: window.location.origin + "/checkout/success",
          shipping: {
            name: stripeAddress.name,
            address: {
              line1: stripeAddress.address.line1,
              city: stripeAddress.address.city,
              postal_code: stripeAddress.address.postal_code,
              country: stripeAddress.address.country,
            },
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setIsLoading(false);
        return;
      }
      if (result.paymentIntent.status == "succeeded") {
        // payment succeeded
        toast.success("Payment successful!");

        // clear basket cookie
        Cookies.remove("basketPublicId");

        // invalidate basket query
        queryClient.setQueryData(["basket"], null);
        queryClient.invalidateQueries(["basket"]);

        // navigate to success page
        navigate("/checkout/success");
      }
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 3 }}>
        {/* Step 0: Address */}
        <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>
          <AddressElement options={{ mode: "shipping" }} />
          <FormControlLabel
            sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
            control={
              <Checkbox
                checked={saveAddressChecked}
                onChange={(e) => setSaveAddressChecked(e.target.checked)}
              />
            }
            label="Save as default address"
          />
        </Box>

        {/* Step 1: Payment */}
        <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>
          <PaymentElement />
        </Box>

        {/* Step 2: Review */}
        <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
          <ReviewOrder
            stripeAddress={stripeAddress}
            onPay={handlePay}
            isLoading={isLoading}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>

        {activeStep < steps.length - 1 && (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Paper>
  );
}
