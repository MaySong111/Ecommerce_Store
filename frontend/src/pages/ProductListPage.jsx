import ProductCard from "../components/ProductCard";
import { Box, Grid2, Pagination, Typography } from "@mui/material";
import { useProducts } from "../hooks/useProducts";
import Filters from "../components/Filters";
import { useState } from "react";
import { pageSize } from "../api/http";

export default function ProductListPage() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    sortBy: "name",
    brands: [],
    types: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const { data, isProductsLoading } = useProducts(
    null,
    filters,
    pageSize,
    currentPage
  );

  const products = data?.products || [];
  const totalCount = data?.totalItems || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  var brandList = [...new Set(products?.map((p) => p.brand))];
  var typeList = [...new Set(products?.map((p) => p.type))];

  //  如果search的内容不存在的, 那不显示products是正常的,但仍然会显示checkobx只是没有内容, 我觉得不对,应该隐藏整个filter区域
  // 所以这里加了一个判断, 只有brandList或者typeList有内容的时候才显示filter区域: 统一判断，整个 Filters 隐藏
  const showFilters = brandList.length > 0 || typeList.length > 0;

  if (isProductsLoading || !products) return <div>Loading...</div>;

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={3}>
        {showFilters && (
          <Filters
            filters={filters}
            setFilters={setFilters}
            products={products}
            brandList={brandList}
            typeList={typeList}
          />
        )}
      </Grid2>
      <Grid2 size={9} container spacing={3}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6">
              No products found for your search.
            </Typography>
          </Box>
        )}

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChange}
          color="secondary"
          sx={{ mt: 4, mx: "auto" }}
        />
      </Grid2>
    </Grid2>
  );
}
