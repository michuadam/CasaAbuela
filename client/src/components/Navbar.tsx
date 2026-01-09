import { useState, useEffect } from "react";
import { ShoppingBag, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Cart } from "./Cart";
import logo from "@assets/Casa_Abuela_1765220386882.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        cartCount > 0 ? "top-9" : "top-0"
      } ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-stone-100 py-3 shadow-sm"
          : "bg-transparent py-6 text-white"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide">
          <a 
            href="#story" 
            className="hover:text-primary/80 transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            O NAS
          </a>
          <a 
            href="#products" 
            className="hover:text-primary/80 transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            SKLEP
          </a>
        </div>

        <Link href="/" className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="Casa Abuela" 
            className={`h-16 md:h-20 w-auto transition-opacity duration-300 ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`} 
          />
        </Link>

        <div className="hidden md:flex items-center gap-6 font-medium text-sm tracking-wide">
          <a 
            href="#process" 
            className="hover:text-primary/80 transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            PROCES
          </a>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-transparent"
                  data-testid="button-user-menu"
                >
                  {(user as any)?.profileImageUrl ? (
                    <img 
                      src={(user as any).profileImageUrl} 
                      alt="Profil" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-sm text-muted-foreground" disabled>
                  {user?.email || "Moje konto"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer" data-testid="button-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Wyloguj się
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-transparent"
              onClick={() => window.location.href = '/login'}
              data-testid="button-login"
            >
              <User className="h-5 w-5" />
            </Button>
          )}
          
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

        <div className="md:hidden flex items-center gap-3">
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-inherit hover:bg-transparent"
              onClick={() => logout()}
              data-testid="button-logout-mobile"
            >
              <User className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-inherit hover:bg-transparent"
              onClick={() => window.location.href = '/login'}
              data-testid="button-login-mobile"
            >
              <User className="h-5 w-5" />
            </Button>
          )}
          
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
                <a 
                  href="#story" 
                  className="text-primary hover:text-primary/70 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  O Nas
                </a>
                <a 
                  href="#products" 
                  className="text-primary hover:text-primary/70 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Sklep
                </a>
                <a 
                  href="#process" 
                  className="text-primary hover:text-primary/70 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Proces
                </a>
                <a 
                  href="#contact" 
                  className="text-primary hover:text-primary/70 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Kontakt
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Cart open={isCartOpen} onOpenChange={setIsCartOpen} />
    </nav>
  );
}
