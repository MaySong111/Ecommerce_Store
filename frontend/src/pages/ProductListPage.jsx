import ProductCard from "../components/ProductCard";
import { Box, Button, Container, Typography } from "@mui/material";
import { useProducts } from "../hooks/useProducts";

export default function ProductListPage() {
  const { products, isProductsLoading } = useProducts();
  if (isProductsLoading || !products) return <div>Loading...</div>;

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          marginY: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Products List
        </Typography>
        <Button variant="contained" onClick={() => {}}>
          Add New Product
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>
    </Container>
  );
}
