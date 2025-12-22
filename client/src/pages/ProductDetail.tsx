import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Package, Coffee, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import productBag from "@assets/Gemini_Generated_Image_49qvov49qvov49qv_1765237897906.png";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useProduct(slug);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (!data?.product) return;
    
    setIsAdding(true);
    addToCart.mutate(
      { productId: data.product.id, quantity },
      {
        onSuccess: () => {
          toast.success(`${data.product.title} ${data.product.weight} dodano do koszyka!`);
          setIsAdding(false);
        },
        onError: () => {
          toast.error("Nie udało się dodać do koszyka");
          setIsAdding(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 py-32 text-center">
          <p className="text-muted-foreground">Ładowanie produktu...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 py-32 text-center">
          <h1 className="font-serif text-3xl text-primary mb-4">Produkt nie znaleziony</h1>
          <p className="text-muted-foreground mb-8">Przepraszamy, ten produkt nie istnieje.</p>
          <Link href="/#products">
            <Button variant="outline" className="rounded-none">
              <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do sklepu
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { product, images } = data;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/#products">
            <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-primary -ml-4" data-testid="button-back-to-shop">
              <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do sklepu
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square bg-[#F9F7F2] rounded-sm p-12 flex items-center justify-center sticky top-24">
                <img 
                  src={product.imageUrl || productBag} 
                  alt={`${product.title} ${product.weight}`}
                  className="w-full h-full object-contain drop-shadow-xl"
                  data-testid="img-product-main"
                />
              </div>
              
              {images && images.length > 0 && (
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                  {images.map((img) => (
                    <div 
                      key={img.id} 
                      className="w-20 h-20 flex-shrink-0 bg-[#F9F7F2] rounded-sm p-2"
                    >
                      <img 
                        src={img.imageUrl} 
                        alt={img.altText || ""} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <span className="text-primary/60 uppercase tracking-[0.2em] text-sm font-bold">
                  {product.type === "beans" ? "Ziarnista" : "Mielona"} • {product.weight}
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4" data-testid="text-product-title">
                {product.title}
              </h1>

              <div className="text-3xl font-semibold text-primary mb-8" data-testid="text-product-price">
                {product.price} PLN
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8" data-testid="text-product-description">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-[#F9F7F2] p-4 rounded-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Coffee className="h-5 w-5 text-primary/60" />
                    <span className="text-sm font-medium text-primary">Palenie</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{product.roast}</p>
                </div>
                
                <div className="bg-[#F9F7F2] p-4 rounded-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="h-5 w-5 text-primary/60" />
                    <span className="text-sm font-medium text-primary">Waga</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{product.weight}</p>
                </div>
              </div>

              {product.origin && (
                <div className="mb-6">
                  <h3 className="font-serif text-lg text-primary mb-2">Pochodzenie</h3>
                  <p className="text-muted-foreground">{product.origin}</p>
                </div>
              )}

              {product.tastingNotes && (
                <div className="mb-8">
                  <h3 className="font-serif text-lg text-primary mb-2">Nuty smakowe</h3>
                  <p className="text-muted-foreground">{product.tastingNotes}</p>
                </div>
              )}

              <div className="border-t border-primary/10 pt-8 mt-auto">
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-sm font-medium text-primary">Ilość:</span>
                  <div className="flex items-center border border-primary/20">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-primary/5 transition-colors"
                      data-testid="button-decrease-quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-6 py-3 font-medium" data-testid="text-quantity">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-primary/5 transition-colors"
                      data-testid="button-increase-quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  disabled={isAdding || !product.inStock}
                  className="w-full bg-primary text-white hover:bg-primary/90 rounded-none h-14 uppercase tracking-widest text-sm"
                  data-testid="button-add-to-cart"
                >
                  <ShoppingBag className="mr-3 h-5 w-5" /> 
                  {isAdding ? "Dodaję..." : product.inStock ? "Dodaj do koszyka" : "Brak w magazynie"}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
