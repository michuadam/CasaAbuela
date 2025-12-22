import { useQuery } from "@tanstack/react-query";
import type { Product, ProductImage } from "@shared/schema";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery<{ product: Product; images: ProductImage[] }>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
    enabled: !!slug,
    retry: 3,
    staleTime: 1000 * 60 * 5,
  });
}
