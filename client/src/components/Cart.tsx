import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Cart({ open, onOpenChange }: CartProps) {
  const { cartItems, cartTotal, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-white border-l border-stone-200">
        <SheetHeader className="border-b border-stone-200 pb-4">
          <SheetTitle className="font-serif text-2xl text-primary">Koszyk</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <p className="text-muted-foreground mb-2">Twój koszyk jest pusty</p>
            <p className="text-sm text-muted-foreground">Dodaj produkty, aby kontynuować</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 my-6" style={{ height: 'calc(100vh - 250px)' }}>
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-stone-100" data-testid={`cart-item-${item.id}`}>
                    <div className="w-20 h-20 bg-[#F9F7F2] rounded-sm flex items-center justify-center flex-shrink-0">
                      <img 
                        src="/Gemini_Generated_Image_49qvov49qvov49qv_1765237897906.png" 
                        alt={item.product?.title || 'Product'}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-primary mb-1" data-testid={`text-cart-item-name-${item.id}`}>
                        {item.product?.title} {item.product?.weight}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.product?.type === 'beans' ? 'Ziarnista' : 'Mielona'}</p>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-stone-200 rounded-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none hover:bg-stone-100"
                            onClick={() => {
                              if (item.quantity === 1) {
                                removeItem.mutate(item.id);
                              } else {
                                updateQuantity.mutate({ id: item.id, quantity: item.quantity - 1 });
                              }
                            }}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center text-sm" data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none hover:bg-stone-100"
                            onClick={() => updateQuantity.mutate({ id: item.id, quantity: item.quantity + 1 })}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem.mutate(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col justify-between">
                      <p className="font-semibold text-primary" data-testid={`text-item-total-${item.id}`}>
                        {(parseFloat(item.product?.price || '0') * item.quantity).toFixed(2)} PLN
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-stone-200 pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-primary">Razem:</span>
                <span className="font-bold text-primary text-xl" data-testid="text-cart-total">{cartTotal.toFixed(2)} PLN</span>
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-none uppercase tracking-widest text-sm"
                data-testid="button-checkout"
              >
                Przejdź do kasy
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full text-sm text-muted-foreground hover:text-primary"
                onClick={() => clearCart.mutate()}
                data-testid="button-clear-cart"
              >
                Wyczyść koszyk
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
