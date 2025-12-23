import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import useBasket from "../hooks/useBasket";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

export default function ReviewOrder() {
  console.log("ReviewOrder component rendered: 第一次渲染");
  const { basket, totalPrice, clearBasketMutation } = useBasket();
  const elements = useElements(); // store address info and card info from stripe elements
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      if (elements) {
        const addressElement = elements.getElement("address");
        if (addressElement) {
          const addressData = await addressElement.getValue();
          setAddress(addressData);
        }
      }
    };
    fetchAddress();
  }, [elements]);
  console.log("Address data object:", address);

  // 2. click pay button to handle payment logic here
  const stripe = useStripe();
  const [isLoading, setIsLoading] = useState(false);

  const handPay = async () => {
    if (!stripe || !elements) return;
    setIsLoading(true);

    // 调用 Stripe API
    const { error } = await stripe.confirmPayment({
      elements, // 包含地址和信用卡信息
      confirmParams: {
        return_url: "http://localhost:3000/orders", // 成功后跳转
      },
    });

    if (error) {
      console.error(error.message);
      setIsLoading(false);
    }
    // clear basket after payment initiated
    clearBasketMutation.mutate();
  };

  return (
    <div>
      <Box mt={4} width="100%">
        <Typography variant="h6" fontWeight="bold">
          Billing and Shipping Information
        </Typography>
        <dl>
          <Typography component="dt" variant="body1">
            Shipping Address
            <p>{address?.value?.name}</p>
            <p>{address?.value?.address.line1}</p>
            <p>
              {address?.value?.address.city},{" "}
              {address?.value?.address.postal_code}
            </p>
          </Typography>
          <Typography component="dd" variant="body2">
            address goes here
          </Typography>

          <Typography component="dt" variant="body1">
            Payment Details
          </Typography>
          <Typography component="dd" variant="body2">
            payment details go here
          </Typography>
        </dl>
      </Box>

      <Box mt={4} width="100%">
        <Divider />
        <TableContainer sx={{ mt: 2 }}>
          <Table>
            <TableBody>
              {basket?.basketItems?.map((item) => (
                <TableRow
                  key={item.productId}
                  sx={{ borderBottom: "1px solid rgba(224,224,224,1)" }}
                >
                  <TableCell sx={{ py: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <img
                        src={item.pictureUrl}
                        alt={item.name}
                        style={{ width: 40, height: 40 }}
                      />
                      <Typography>{item.name}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 4 }}>
                    <Typography>x {item.quantity}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />

        {/* pay button   */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="primary"
            disabled={isLoading || !stripe}
            onClick={handPay}
          >
            {isLoading
              ? "Processing..."
              : `Pay $${(totalPrice / 100).toFixed(2)}`}
          </Button>
        </Box>
      </Box>
    </div>
  );
}
