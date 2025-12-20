import { useParams } from "react-router-dom";
import {
  Button,
  Divider,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useProducts } from "../hooks/useProducts";
import useBasket from "../hooks/useBasket";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, isProductLoading } = useProducts(id);
  const { addBasketItemMutation } = useBasket();
  if (isProductLoading || !product) return <div>Loading...</div>;

  const productDetails = [
    { label: "Name", value: product.name },
    { label: "Description", value: product.description },
    { label: "Type", value: product.type },
    { label: "Brand", value: product.brand },
    { label: "Quantity in stock", value: product.quantityInStock },
  ];

  return (
    <Grid2 container spacing={2} maxWidth="lg" sx={{ mx: "auto" }}>
      <Grid2 size={6}>
        <img
          src={product?.pictureUrl}
          alt={product?.name}
          style={{ width: "100%", maxHeight: "480px", objectFit: "contain" }}
        />
      </Grid2>
      <Grid2 size={6}>
        <Typography variant="h3">{product?.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product?.price / 100).toFixed(2)}
        </Typography>

        <TableContainer>
          <Table sx={{ maxWidth: 600, marginTop: 2 }}>
            <TableBody>
              {productDetails.map((detail) => (
                <TableRow key={detail.label}>
                  <TableCell
                    sx={{ fontSize: 14, fontWeight: "bold", border: "none" }}
                  >
                    {detail.label}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: 14, fontWeight: "bold", border: "none" }}
                  >
                    {detail.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid2 container spacing={2} marginTop={3}>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in cart"
              fullWidth
              defaultValue={1}
              inputProps={{ min: 1, max: product.quantityInStock }}
            />
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={{ height: "52px" }}
              size="large"
              color="primary"
              variant="contained"
              fullWidth
              onClick={() =>
                addBasketItemMutation.mutate({ productId: product.id })
              }
            >
              Add to Cart
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
