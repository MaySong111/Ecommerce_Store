import {
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import useBasket from "../hooks/useBasket";
import { discount } from "../api/http";

export default function OrderSummary() {


  const location = useLocation();

  const { data, isLoading, totalCount } = useBasket();
  console.log("basket total count from useBasket hook:", totalCount);

  const basket = data?.basket;
  if (isLoading) return <Typography>Loading...</Typography>;


  const subtotal =
    basket?.basketItems?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) ?? 0;

  const deliveryFee = subtotal > 20000 ? 0 : 500;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth="lg"
      mx="auto"
    >
      <Paper sx={{ mb: 2, p: 3, width: "100%", borderRadius: 3 }}>
        <Typography variant="h6" component="p" fontWeight="bold">
          Order summary
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          Orders over $200 qualify for free delivery!
        </Typography>
        <Box mt={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Subtotal</Typography>
            <Typography>${(subtotal / 100).toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Discount</Typography>
            <Typography color="success">
              ${(discount / 100).toFixed(2)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Delivery fee</Typography>
            <Typography>${(deliveryFee / 100).toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Total</Typography>
            <Typography>
              ${((subtotal + deliveryFee) / 100).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Box mt={2}>
          {!location.pathname.includes("/checkout") && (
            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 1 }}
            >
              Checkout
            </Button>
          )}
          <Button component={Link} to="/products" fullWidth>
            Continue Shopping
          </Button>
        </Box>
      </Paper>

      {/* Coupon Code Section */}
      <Paper sx={{ width: "100%", borderRadius: 3, p: 3 }}>
        <form onSubmit={() => {}}>
          <Typography variant="subtitle1" component="label">
            Do you have a voucher code?
          </Typography>

          <TextField
            label="Voucher code"
            variant="outlined"
            fullWidth
            sx={{ my: 2 }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Apply code
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
