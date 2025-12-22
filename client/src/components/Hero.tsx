import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@assets/babcia_new_1766367642126.webp";

export function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Plantacja kawy Casa Abuela"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      </div>

      {/* Content - positioned to the right to avoid overlapping left side text */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-end text-right text-white pr-8 md:pr-16">
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight max-w-lg"
        >
          Kawa z Serca Huila
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base md:text-lg max-w-md mb-8 text-white/90 font-light leading-relaxed"
        >
          Prawdziwa kolumbijska kawa prosto z rodzinnej plantacji.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-stone-100 rounded-none px-8 py-6 text-base tracking-wide font-medium border border-transparent hover:border-white/20 transition-all duration-300"
            onClick={() => {
              const element = document.getElementById('products');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            data-testid="button-discover-beans"
          >
            ODKRYJ NASZE ZIARNA
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
