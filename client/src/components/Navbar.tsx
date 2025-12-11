import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Cart } from "./Cart";
import logo from "@assets/Casa_Abuela_1765220386882.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-stone-100 py-3 shadow-sm"
          : "bg-transparent py-6 text-white"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide">
          <a href="#story" className="hover:text-primary/80 transition-colors">
            O NAS
          </a>
          <a href="#products" className="hover:text-primary/80 transition-colors">
            SKLEP
          </a>
        </div>

        <Link href="/" className="flex items-center gap-2">
          <img src={logo} alt="Casa Abuela" className="h-16 md:h-20 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide">
          <a href="#process" className="hover:text-primary/80 transition-colors">
            PROCES
          </a>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-transparent relative"
            onClick={() => setIsCartOpen(true)}
            data-testid="button-cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="text-cart-count">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-inherit hover:bg-transparent relative"
            onClick={() => setIsCartOpen(true)}
            data-testid="button-cart-mobile"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-inherit hover:bg-transparent">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#F9F7F2] border-none w-[300px]">
              <div className="flex flex-col gap-8 mt-12 items-center font-serif text-xl">
                <a href="#story" className="text-primary hover:text-primary/70">O Nas</a>
                <a href="#products" className="text-primary hover:text-primary/70">Sklep</a>
                <a href="#process" className="text-primary hover:text-primary/70">Proces</a>
                <a href="#contact" className="text-primary hover:text-primary/70">Kontakt</a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Cart open={isCartOpen} onOpenChange={setIsCartOpen} />
    </nav>
  );
}
