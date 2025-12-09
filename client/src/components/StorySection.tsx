import { motion } from "framer-motion";
import familyImg from "@assets/WhatsApp_Image_2025-12-04_at_14.33.13_1764877056267.jpeg";
import meliImg from "@assets/website_meli_1765221742696.jpg";
import handsImg from "@assets/generated_images/farmer_hands_holding_coffee_cherries.png";

export function StorySection() {
  return (
    <section id="story" className="py-24 md:py-32 bg-[#F9F7F2]">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* First Block: Introduction */}
        <motion.div 
          initial={{ opacity: 0, x: 300 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32"
        >
          <div className="relative pr-8 lg:pr-0">
             {/* Back Image (Meli) - Positioned to the right and behind */}
            <div className="absolute top-8 left-1/2 ml-4 lg:ml-12 lg:left-24 w-full max-w-xs aspect-[3/4] bg-white p-2 shadow-lg -rotate-3 rounded-sm -z-0">
               <img 
                src={meliImg} 
                alt="Młode pokolenie na plantacji" 
                className="w-full h-full object-cover filter sepia-[.15] contrast-[1.05]"
              />
            </div>

            {/* Front Image (Grandma) */}
            <div className="relative z-10 aspect-[3/4] w-full max-w-xs mx-auto lg:mx-0 overflow-hidden rounded-sm shadow-lg rotate-2 bg-white p-2">
              <img 
                src={familyImg} 
                alt="Babcia, 97 lat, serce naszej plantacji" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 filter sepia-[.15] contrast-[1.05]"
              />
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-primary/20 -z-10 hidden md:block -rotate-6" />
          </div>

          <div className="space-y-8">
            <span className="text-primary/60 uppercase tracking-[0.2em] text-sm font-bold">Nasza Historia</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-primary leading-tight">
              Dwa pokolenia.<br/>Jedna pasja.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Nasza plantacja w regionie Huila to historia, która łączy pokolenia. Babcia, która ma 97 lat, przekazała nam swoją wiedzę i miłość do ziemi. 
              Dziś wspólnie z wnuczką Meli, która dorastała wśród kawowców, dbają o to, by tradycja spotykała się z nowoczesnym podejściem.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              To połączenie doświadczenia i młodości sprawia, że nasza kawa jest wyjątkowa. Szacunek do natury, którego nauczyła nas Babcia, 
              jest teraz pielęgnowany przez młode pokolenie, które z dumą kontynuuje to niezwykłe dziedzictwo.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
