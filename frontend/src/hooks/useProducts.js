import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "../api/http";

export function useProducts(
  id = null,
  filters = {},
  pageSize = null,
  currentPage = null
) {
  const { data, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products", filters, pageSize, currentPage],
    queryFn: () => getProducts(filters, pageSize, currentPage),
  });

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  return {
    data,
    product,
    isProductLoading,
    isProductsLoading,
  };
}
