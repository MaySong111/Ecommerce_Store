import { Link, useParams } from "react-router-dom";
import { useFetchOrderDetailedQuery } from "../hooks/useOrder";
import {
  Box,
  Button,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { orderStatus } from "../api/http";

function currencyFormat(amount) {
  return `$${(amount / 100).toFixed(2)}`;
}

export default function OrderDetailedPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useFetchOrderDetailedQuery(id);

  if (isLoading) return <Typography variant="h5">Loading order...</Typography>;
  if (!order) return <Typography variant="h5">Order not found</Typography>;

  return (
    <Card sx={{ p: 2, maxWidth: "md", mx: "auto" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Order summary for #{order.id}</Typography>
        <Button component={Link} to="/orders" variant="outlined">
          Back to orders
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Shipping address
        </Typography>
        <Typography variant="body2">{order.shippingAddress}</Typography>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Order details
        </Typography>
        <Typography variant="body2">Email: {order.buyerEmail}</Typography>
        <Typography variant="body2">
          Status: {orderStatus[order.orderStatus]}
        </Typography>
        <Typography variant="body2">
          Date: {format(new Date(order.orderDate), "dd MMM yyyy HH:mm")}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Table>
        <TableBody>
          {order.orderItems.map((item) => (
            <TableRow key={item.productId}>
              <TableCell>
                <Box display="flex" gap={2} alignItems="center">
                  <img
                    src={item.pictureUrl}
                    alt={item.productName}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <Typography>{item.productName}</Typography>
                </Box>
              </TableCell>
              <TableCell align="center">x {item.quantity}</TableCell>
              <TableCell align="right">
                {currencyFormat(item.price * item.quantity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box mx={3} mt={2}>
        <Box display="flex" justifyContent="space-between">
          <Typography>Subtotal</Typography>
          <Typography>{currencyFormat(order.subtotal)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography>Delivery fee</Typography>
          <Typography>{currencyFormat(order.deliveryFee)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {currencyFormat(order.subtotal + order.deliveryFee)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
