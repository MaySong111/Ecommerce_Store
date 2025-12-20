import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import useBasket from "../hooks/useBasket";

export default function ProductCard({ product }) {
  const { addBasketItemMutation } = useBasket();
  
  return (
    <Card
      elevation={3}
      sx={{
        width: 250,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        sx={{ height: 240, backgroundSize: "cover" }}
        image={product.pictureUrl}
        title={product.name}
      ></CardMedia>

      <CardContent>
        <Typography
          gutterBottom
          variant="subtitle2"
          sx={{ textTransform: "uppercase" }}
        >
          {product.name}
        </Typography>
        <Typography variant="h6" sx={{ color: "secondary.main" }}>
          ${(product.price / 100).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            // console.log("adding to basket", product.id);
            addBasketItemMutation.mutate({
              productId: product.id,
              quantity: 1,
            });
          }}
        >
          Add to Cart
        </Button>
        <Button
          size="small"
          color="primary"
          component={Link}
          to={`/products/${product.id}`}
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
}
