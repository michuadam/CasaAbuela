import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Droplets, Flame } from "lucide-react";
import productBag from "@assets/generated_images/premium_coffee_bag_on_wooden_table.png";

const products = [
  {
    id: "espresso",
    title: "Huila Espresso",
    tagline: "Głębia i Charakter",
    roast: "Ciemne (Dark Roast)",
    description: "Intensywna i pełna smaku. Idealna do espresso i kaw mlecznych. Długo wypalana, aby wydobyć nuty czekolady i orzechów.",
    price: "59.00 PLN",
    weight: "250g",
    notes: ["Ciemna Czekolada", "Karmel", "Prażone Orzechy"],
    ratings: {
      boldness: 5, // Moc/Body
      acidity: 2   // Kwasowość
    }
  },
  {
    id: "filter",
    title: "Huila Filter",
    tagline: "Owocowa Lekkość",
    roast: "Jasne (Light Roast)",
    description: "Delikatna i aromatyczna. Stworzona do metod przelewowych. Podkreśla naturalną kwasowość i słodycz regionu Huila.",
    price: "65.00 PLN",
    weight: "250g",
    notes: ["Cytrusy", "Czerwone Owoce", "Miód"],
    ratings: {
      boldness: 3, 
      acidity: 5
    }
  }
];

function RatingDots({ label, value, max = 5 }: { label: string, value: number, max?: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs uppercase tracking-widest w-24 text-primary/60 font-medium">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div 
            key={i} 
            className={`h-2 w-2 rounded-full ${i < value ? 'bg-primary' : 'bg-primary/10'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function Products() {
  return (
    <section id="products" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary/60 uppercase tracking-[0.2em] text-sm font-bold block mb-4">Nasze Ziarna</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-primary mb-6">
            Dwa style, jedno pochodzenie
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Wybierz profil palenia idealnie dopasowany do Twojego rytuału.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group relative bg-[#F9F7F2] p-8 md:p-12 rounded-sm overflow-hidden"
            >
              {/* Product Content Layout */}
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                
                {/* Image Section */}
                <div className="w-full md:w-1/2 relative">
                  <div className="aspect-[3/4] relative z-10 overflow-hidden rounded-sm shadow-xl rotate-1 group-hover:rotate-0 transition-transform duration-500">
                     <img 
                      src={productBag} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative background blob */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-0" />
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div>
                    <span className="text-primary/60 text-xs font-bold tracking-widest uppercase mb-2 block">{product.roast}</span>
                    <h3 className="font-serif text-3xl text-primary font-medium">{product.title}</h3>
                    <p className="text-primary/50 font-serif italic">{product.tagline}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.notes.map(note => (
                      <span key={note} className="px-3 py-1 border border-primary/20 rounded-full text-xs uppercase tracking-wide text-primary/80">
                        {note}
                      </span>
                    ))}
                  </div>

                  <p className="text-muted-foreground font-light text-sm leading-relaxed">
                    {product.description}
                  </p>

                  <div className="space-y-3 pt-2 border-t border-primary/10">
                    <RatingDots label="Kwasowość" value={product.ratings.acidity} />
                    <RatingDots label="Moc / Body" value={product.ratings.boldness} />
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-serif font-bold text-primary">{product.price}</span>
                      <span className="text-xs text-muted-foreground">{product.weight}</span>
                    </div>
                    <Button size="lg" className="rounded-none bg-primary hover:bg-primary/90">
                      <ShoppingBag className="mr-2 h-4 w-4" /> Kup Teraz
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
