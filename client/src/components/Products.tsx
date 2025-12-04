import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import espressoImg from "@assets/generated_images/dark_roast_espresso_coffee_beans.png";
import dripImg from "@assets/generated_images/light_roast_drip_coffee_beans.png";

const categories = [
  {
    id: "espresso",
    title: "Do Ekspresu",
    subtitle: "Espresso Roast",
    description: "Ciemniejsze palenie, idealne do ekspresów ciśnieniowych i kawiarek. Gęste, intensywne, z nutami ciemnej czekolady i karmelu.",
    image: espressoImg,
    price: "od 59.00 PLN"
  },
  {
    id: "drip",
    title: "Do Przelewów",
    subtitle: "Filter Roast",
    description: "Jaśniejsze palenie, stworzone dla metod alternatywnych (Drip, Chemex, Aeropress). Podkreśla owocowość i kwasowość ziarna.",
    image: dripImg,
    price: "od 65.00 PLN"
  }
];

export function Products() {
  return (
    <section id="products" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary/60 uppercase tracking-[0.2em] text-sm font-bold block mb-4">Sklep</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-primary mb-6">
            Wybierz Metodę Parzenia
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Każde ziarno palimy inaczej, aby wydobyć z niego to, co najlepsze dla Twojego ulubionego sposobu parzenia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] mb-8 overflow-hidden rounded-sm">
                 <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-xs font-bold tracking-widest uppercase text-primary">
                  {category.subtitle}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-baseline border-b border-primary/10 pb-4">
                  <h3 className="font-serif text-3xl text-primary font-medium">{category.title}</h3>
                  <span className="text-lg font-medium text-primary/80">{category.price}</span>
                </div>
                
                <p className="text-muted-foreground font-light leading-relaxed">
                  {category.description}
                </p>
                
                <div className="pt-4 flex items-center text-primary font-medium text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                  Zobacz produkty <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
