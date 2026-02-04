import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useFetchOrdersQuery } from "../hooks/useOrder";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { orderStatus } from "../api/http";
import useBasket from "../hooks/useBasket";

function currencyFormat(amount) {
  return `$${(amount / 100).toFixed(2)}`;
}
export default function OrdersPage() {
  const { data: orders, isLoading } = useFetchOrdersQuery();
  console.log("OrdersPage fetch orders:", orders);
  const navigate = useNavigate();
  const { buyAgainMutation } = useBasket();

  if (isLoading) return <Typography variant="h5">Loading orders...</Typography>;
  if (!orders || orders.length === 0)
    return <Typography variant="h5">No orders available</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" gutterBottom>
        My orders
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {orders.map((order) => (
          <Paper
            key={order.id}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 2,
              cursor: "pointer",
              "&:hover": { boxShadow: 4 },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="bold">
                Order #{order.id}
              </Typography>
              <Box
                sx={{
                  bgcolor: "#e8f5e9",
                  color: "#2e7d32",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">
                  {orderStatus[order.orderStatus]}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(order.orderDate), "dd MMM yyyy")}
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {currencyFormat(order.subtotal + order.deliveryFee)}
              </Typography>
            </Box>

            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                }}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                View Details
              </Button>

              <Button
                color="main.bg"
                variant="contained"
                sx={{
                  mt: 2,
                }}
                onClick={() => {
                  buyAgainMutation.mutate(order.id);
                  navigate("/checkout");
                }}
              >
                Buy Again
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
