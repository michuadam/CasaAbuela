import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import productImg from "@assets/generated_images/premium_coffee_bag_on_wooden_table.png";

const products = [
  {
    id: 1,
    name: "Huila Especial",
    process: "Myta (Washed)",
    notes: "Czekolada, Karmel, Cytrusy",
    price: "59.00 PLN",
    weight: "250g",
    image: productImg
  },
  {
    id: 2,
    name: "Finca La Familia",
    process: "Naturalna",
    notes: "Czerwone Owoce, Miód, Wino",
    price: "65.00 PLN",
    weight: "250g",
    image: productImg
  },
  {
    id: 3,
    name: "Reserva Don Pablo",
    process: "Honey",
    notes: "Jaśmin, Brzoskwinia, Wanilia",
    price: "79.00 PLN",
    weight: "250g",
    image: productImg
  }
];

export function Products() {
  return (
    <section id="products" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary/60 uppercase tracking-[0.2em] text-sm font-bold block mb-4">Sklep</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-primary mb-6">
            Wybierz Swoją Kawę
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Świeżo palona, pakowana ręcznie i wysyłana prosto do Ciebie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-[#F5F5F0] rounded-sm">
                 <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-serif text-2xl text-primary font-medium">{product.name}</h3>
                <div className="text-sm text-primary/60 uppercase tracking-wider font-medium">{product.process}</div>
                <p className="text-muted-foreground font-light italic">{product.notes}</p>
                <div className="pt-4 flex items-center justify-center gap-4">
                   <span className="text-lg font-semibold text-primary">{product.price}</span>
                </div>
                <Button 
                  className="w-full mt-4 bg-primary text-white hover:bg-primary/90 rounded-none h-12 uppercase tracking-widest text-xs"
                >
                  Dodaj do koszyka
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
