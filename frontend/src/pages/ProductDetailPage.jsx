import { useNavigate, useParams } from "react-router-dom";
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
// import { useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { BsLightning } from "react-icons/bs";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // console.log("ProductDetailPage id:", id);
  const { product, isProductLoading } = useProducts(id);
  const { addBasketItemMutation } = useBasket();
  // const [quantity, setQuantity] = useState(1);

  if (isProductLoading || !product) return <div>Loading...</div>;

  const productDetails = [
    { label: "Name", value: product.name },
    { label: "Description", value: product.description },
    { label: "Type", value: product.type },
    { label: "Brand", value: product.brand },
  ];

  // 一旦添加的数量超过库存，就不允许添加,按钮变灰--防止重复请求
  // 1. 在发请求前, 先在前端验证
  // 1.1 从购物车中找到该商品-如果没有那就是现在购物车中没有添加这个商品,itemInBasket.quantity要报错的因为找不到这个item在basket
  // const itemInBasket = basket?.basketItems?.find(
  //   (item) => item.productId === product.id
  // );

  // 1.2 获取剩余库存（优先用后端返回的，没有就前端直接算）
  // const remainingStock = itemInBasket
  //   ? product.quantityInStock - itemInBasket.quantity
  //   : product.quantityInStock;
  // console.log(remainingStock);

  // 1.3 判断是否可以添加
  // const canAddMore = quantity <= remainingStock;

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
        <Divider sx={{ mb: 3 }} />
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
        <Grid2 container spacing={2} marginTop={8}>
          {/* <Grid2 size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity"
              fullWidth
              defaultValue={1}
              inputProps={{ min: 1, max: remainingStock }}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              helperText={`Only ${remainingStock} left`}
              FormHelperTextProps={{
                sx: {
                  color: "blue",
                  fontSize: "12px",
                },
              }}
            />
          </Grid2> */}
          <Grid2 size={6}>
            <Button
              sx={{ height: "52px" }}
              size="large"
              color="primary"
              variant="contained"
              fullWidth
              onClick={() =>
                addBasketItemMutation.mutate({
                  productId: product.id,
                })
              }
              startIcon={<IoCartOutline />}
            >
              Add to Cart
            </Button>
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={{ height: "52px" }}
              size="large"
              color="main.bg"
              variant="contained"
              fullWidth
              startIcon={<BsLightning />}
              onClick={() => {
                addBasketItemMutation.mutate({
                  productId: product.id,
                });
                navigate("/checkout");
              }}
            >
              Buy Now
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
