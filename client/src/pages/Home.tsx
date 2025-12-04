import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StorySection } from "@/components/StorySection";
import { Products } from "@/components/Products";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <StorySection />
        <Products />
        
        {/* Newsletter / Final CTA */}
        <section className="py-24 bg-[#2C241B] text-white text-center">
           <div className="container mx-auto px-4">
             <h2 className="font-serif text-3xl md:text-5xl mb-6">Dołącz do naszej rodziny</h2>
             <p className="text-white/70 mb-8 max-w-xl mx-auto font-light">
               Zapisz się do newslettera, aby otrzymywać informacje o nowych zbiorach i specjalnych ofertach.
             </p>
             <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
               <input 
                 type="email" 
                 placeholder="Twój adres email" 
                 className="flex-1 bg-transparent border-b border-white/30 py-3 px-2 focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
               />
               <button className="bg-white text-[#2C241B] px-8 py-3 font-medium hover:bg-white/90 transition-colors uppercase tracking-wider text-sm">
                 Zapisz się
               </button>
             </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
