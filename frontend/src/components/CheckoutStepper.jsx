import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { AddressElement, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import ReviewOrder from "./ReviewOrder";

const steps = ["Address", "Payment", "Review"];

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
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

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>
          <AddressElement options={{ mode: "shipping" }} />
          <FormControlLabel
            sx={{ display: "flex", justifyContent: "end" }}
            control={<Checkbox />}
            label="Save as default address"
          ></FormControlLabel>
        </Box>

        <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>
          <PaymentElement />
        </Box>

        <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
          <ReviewOrder />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>

        {/* when activeStep is last step, hide the Next button, because in review step we only show the order summary-pay button */}
        {activeStep === steps.length - 1 ? null : (
          <Button
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            Next
          </Button>
        )}
      </Box>
    </Paper>
  );
}
