import { Grid2, IconButton, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import useBasket from "../hooks/useBasket";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export default function BasketItem({ item }) {
  // console.log("BasketItem every item:", item);
  const {
    removeBasketItemMutation,
    addBasketItemMutation,
    decreaseBasketItemMutation,
  } = useBasket();

  return (
    <Paper
      sx={{
        height: 140,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          component="img"
          src={item.pictureUrl}
          alt={item.name}
          sx={{ height: 100, width: 100, objectFit: "cover", mr: 8, ml: 4 }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h6">{item.name}</Typography>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Typography sx={{ fontSize: "1.1rem" }}>
              ${(item.price / 100).toFixed(2)}
            </Typography>
            <Typography sx={{ fontSize: "1.1rem" }} color="primary">
              Total: ${((item.price / 100) * item.quantity).toFixed(2)}
            </Typography>
          </Box>
          {/* --------------------------deduct quantity */}
          {/* item.quantity: total quantity in cart for this product */}
          <Grid2 container spacing={1} alignItems="center">
            <IconButton
              size="small"
              color="error"
              sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
              onClick={() =>
                decreaseBasketItemMutation.mutate({
                  productId: item.productId,
                })
              }
            >
              {item.quantity > 1 ? <RemoveIcon /> : <DeleteIcon />}
            </IconButton>

            <Typography variant="h6">{item.quantity}</Typography>

            {/* --------------------------add quantity */}
            <IconButton
              size="small"
              color="success"
              sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
              onClick={() =>
                addBasketItemMutation.mutate({ productId: item.productId })
              }
            >
              <AddIcon />
            </IconButton>
          </Grid2>
        </Box>
      </Box>

      {/* --------------------------remove item-X icon */}
      <IconButton
        color="error"
        size="small"
        sx={{
          border: 1,
          borderRadius: 1,
          minWidth: 0,
          alignSelf: "start",
          mr: 1,
          mt: 1,
        }}
      >
        <CloseIcon
          onClick={() =>
            removeBasketItemMutation.mutate({
              productId: item.productId,
            })
          }
        />
      </IconButton>
    </Paper>
  );
}
