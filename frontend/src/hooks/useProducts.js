import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../api/http";
import toast from "react-hot-toast";

export function useProducts(id = null) {
  const queryClient = useQueryClient();

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  const createProductMutation = useMutation({
    mutationFn: (p) => createProduct(p),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Successfully created product!");
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Failed to create product.");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, product }) => updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Successfully updated product!");
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Failed to create product.");
    },
  });

  return {
    products,
    product,
    isProductLoading,
    isProductsLoading,
    createProduct: createProductMutation,
    updateProduct: updateProductMutation,
  };
}
