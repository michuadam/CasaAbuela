import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const FREE_SHIPPING_THRESHOLD = 150;

export function FreeShippingBar() {
  const { cartTotal } = useCart();
  
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;
  const hasFreeshipping = remaining <= 0;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-[60] ${
          hasFreeshipping 
            ? "bg-green-600" 
            : "bg-primary"
        } text-white py-2 px-4 text-center text-sm`}
        data-testid="free-shipping-bar"
      >
        <div className="container mx-auto flex items-center justify-center gap-2">
          {hasFreeshipping ? (
            <>
              <Truck className="h-4 w-4" />
              <span className="font-medium">
                Masz darmową dostawę! 🎉
              </span>
            </>
          ) : (
            <>
              <Package className="h-4 w-4" />
              <span>
                📦 Brakuje Ci tylko <strong>{remaining.toFixed(2)} zł</strong> do darmowej dostawy
              </span>
            </>
          )}
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 w-full">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
