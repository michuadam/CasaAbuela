import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import productBag from "@assets/Gemini_Generated_Image_49qvov49qvov49qv_1765237897906.png";

export function Products() {
  const { data: products = [], isLoading } = useProducts();
  const { addToCart } = useCart();

  const handleAddToCart = (productId: string, productTitle: string) => {
    addToCart.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success(`${productTitle} dodano do koszyka!`);
        },
        onError: () => {
          toast.error("Nie udało się dodać do koszyka");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <section id="products" className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">Ładowanie produktów...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary/60 uppercase tracking-[0.2em] text-sm font-bold block mb-4">Sklep</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-primary mb-6">
            Wybierz Swoją Wersję
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Ziarnista czy mielona? Mała paczka na spróbowanie czy kilogram ulubionego smaku?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group flex flex-col h-full"
            >
              <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-[#F9F7F2] rounded-sm p-6 flex items-center justify-center">
                 <img 
                  src={productBag} 
                  alt={`${product.title} ${product.weight}`}
                  className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                  data-testid={`img-product-${product.id}`}
                />
              </div>
              
              <div className="text-center space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl text-primary font-medium" data-testid={`text-product-name-${product.id}`}>
                    {product.title} <span className="text-primary/60 font-sans text-base">{product.weight}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 font-light leading-relaxed px-2">
                    {product.description}
                  </p>
                </div>
                
                <div className="pt-4">
                   <div className="text-lg font-semibold text-primary mb-3" data-testid={`text-price-${product.id}`}>
                     {product.price} PLN
                   </div>
                   <Button 
                    onClick={() => handleAddToCart(product.id, `${product.title} ${product.weight}`)}
                    disabled={addToCart.isPending}
                    className="w-full bg-primary text-white hover:bg-primary/90 rounded-none h-10 uppercase tracking-widest text-xs"
                    data-testid={`button-add-to-cart-${product.id}`}
                  >
                    <ShoppingBag className="mr-2 h-3 w-3" /> {addToCart.isPending ? "Dodaję..." : "Dodaj"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
