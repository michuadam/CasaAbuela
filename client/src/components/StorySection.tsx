import { motion } from "framer-motion";
import familyImg from "@assets/WhatsApp_Image_2025-12-04_at_14.33.13_1764877056267.jpeg";
import handsImg from "@assets/generated_images/farmer_hands_holding_coffee_cherries.png";

export function StorySection() {
  return (
    <section id="story" className="py-24 md:py-32 bg-[#F9F7F2]">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* First Block: Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] w-full max-w-xs mx-auto lg:mx-0 overflow-hidden rounded-sm shadow-lg rotate-2 bg-white p-2">
              <img 
                src={familyImg} 
                alt="Babcia, 97 lat, serce naszej plantacji" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 filter sepia-[.15] contrast-[1.05]"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 lg:right-auto lg:left-32 w-24 h-24 border border-primary/20 -z-10 hidden md:block rotate-6" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="text-primary/60 uppercase tracking-[0.2em] text-sm font-bold">Nasza Historia</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-primary leading-tight">
              Więcej niż kawa.<br/>To dziedzictwo naszej Babci.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Nasza plantacja w regionie Huila to dom naszej Babci, która ma 97 lat i poświęciła kawie niemal całe swoje życie. 
              Jej doświadczenie i miłość do ziemi są fundamentem wszystkiego, co robimy.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              To ona nauczyła nas, że najlepsza kawa rodzi się z szacunku do natury i cierpliwości. 
              Kontynuujemy jej misję, dbając o tradycję, którą pielęgnuje od dekad, przekazując nam sekrety idealnego ziarna.
            </p>
          </motion.div>
        </div>

        {/* Second Block: The Craft */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:order-2 relative"
          >
             <div className="aspect-square w-full overflow-hidden rounded-sm">
              <img 
                src={handsImg} 
                alt="Ręce farmera z kawą" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
             {/* Decorative Element */}
             <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 -z-10 hidden md:block" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:order-1 space-y-8"
          >
            <span className="text-primary/60 uppercase tracking-[0.2em] text-sm font-bold">Region Huila</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-primary leading-tight">
              Smak wulkanicznej ziemi
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Huila to region pobłogosławiony przez naturę. Wysokie góry Andów, wulkaniczne gleby i idealny mikroklimat 
              tworzą warunki, których nie da się podrobić.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="font-serif text-3xl text-primary mb-2">1.500m</h4>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Wysokość upraw</p>
              </div>
              <div>
                <h4 className="font-serif text-3xl text-primary mb-2">100%</h4>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Arabica</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
