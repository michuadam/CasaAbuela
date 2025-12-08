import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@assets/IMG20251207122133_1765220354258.jpg";

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
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm md:text-base uppercase tracking-[0.2em] font-medium mb-4 text-white/90"
        >
          Prosto z Kolumbii
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          Kawa z Serca <br />
          Regionu Huila
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl max-w-2xl mb-10 text-white/90 font-light leading-relaxed"
        >
          Rodzinna tradycja, wulkaniczna gleba i pasja przekazywana z pokolenia na pokolenie. Odkryj smak prawdziwej kolumbijskiej kawy.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-stone-100 rounded-none px-8 py-6 text-base tracking-wide font-medium border border-transparent hover:border-white/20 transition-all duration-300"
          >
            ODKRYJ NASZE ZIARNA
          </Button>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-widest uppercase">Przewiń</span>
        <div className="w-[1px] h-12 bg-white/40" />
      </motion.div>
    </section>
  );
}
