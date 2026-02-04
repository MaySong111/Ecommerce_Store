import { Grid2, Typography } from "@mui/material";
import useBasket from "../hooks/useBasket";
import BasketItem from "../components/BasketItem";
import OrderSummary from "../components/OrderSummary";

export default function BasketPage() {
  const { basket, isLoading } = useBasket();
  // console.log("basketPublicId, store in cookie:", data?.basketPublicId);
  // console.log("all items in basket,collection:", basket);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (basket.basketItems.length === 0)
    return <Typography variant="h3">Your basket is empty.</Typography>;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={8}>
        {basket?.basketItems?.map((item) => (
          <BasketItem variant="h6" item={item} key={item.productId}>
            Product ID: {item?.productId}, Quantity: {item.quantity}
          </BasketItem>
        ))}
      </Grid2>

      <Grid2 size={4}>
        <OrderSummary />
      </Grid2>
    </Grid2>
  );
}
