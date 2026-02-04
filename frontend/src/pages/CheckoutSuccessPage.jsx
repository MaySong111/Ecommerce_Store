import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      gap={3}
    >
      <Typography variant="h3" color="success.main" fontWeight="bold">
        Payment Successful! 🎉
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Thank you for your purchase. Your order has been confirmed.
      </Typography>
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/orders")}
        >
          VIEW ORDERS
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate("/products")}
        >
          CONTINUE SHOPPING
        </Button>
      </Box>
    </Box>
  );
}
