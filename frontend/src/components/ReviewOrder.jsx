import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@mui/material";
import useBasket from "../hooks/useBasket";

export default function ReviewOrder({ stripeAddress, onPay, isLoading }) {
  const { basket, totalPrice } = useBasket();
  // console.log("ReviewOrder basket:", basket);
  
  return (
    <Box>
      {/* 显示地址 */}
      <Typography variant="h6" fontWeight="bold">
        Shipping Address
      </Typography>
      <Box mt={1}>
        <Typography>{stripeAddress?.name}</Typography>
        <Typography>{stripeAddress?.address?.line1}</Typography>
        <Typography>
          {stripeAddress?.address?.city}, {stripeAddress?.address?.state}{" "}
          {stripeAddress?.address?.postal_code}
        </Typography>
        <Typography>{stripeAddress?.address?.country}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* 显示商品 */}
      <Typography variant="h6" fontWeight="bold">
        Order Items
      </Typography>
      <Table>
        <TableBody>
          {basket?.basketItems?.map((item) => (
            <TableRow key={item.productId}>
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  <img
                    src={item.pictureUrl}
                    alt={item.name}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                  <Typography>{item.name}</Typography>
                </Box>
              </TableCell>
              <TableCell align="center">x {item.quantity}</TableCell>
              <TableCell align="right">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* <Divider sx={{ my: 3 }} /> */}

      {/* 总价 */}
      <Box display="flex" justifyContent="space-between" mb={2} mt={3}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6" fontWeight="bold">
          ${(totalPrice / 100).toFixed(2)}
        </Typography>
      </Box>

      {/* 支付按钮 */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onPay}
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : `Pay $${(totalPrice / 100).toFixed(2)}`}
        </Button>
      </Box>
    </Box>
  );
}
