import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-20 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <a href="/" className="text-3xl font-serif font-bold tracking-tighter mb-6 block">
              CASA ABUELA
            </a>
            <p className="text-primary-foreground/70 max-w-md font-light leading-relaxed">
              Rodzinna plantacja kawy w sercu Kolumbii. Dostarczamy nie tylko ziarna, ale historię, tradycję i pasję, którą wkładamy w każdą filiżankę.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-xl mb-6">Nawigacja</h4>
            <ul className="space-y-4 font-light text-primary-foreground/80">
              <li><a href="#story" className="hover:text-white transition-colors">O Nas</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Sklep</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">Proces produkcji</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Kontakt</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-xl mb-6">Kontakt</h4>
            <ul className="space-y-4 font-light text-primary-foreground/80">
              <li>hello@casaabuela.pl</li>
              <li>+48 123 456 789</li>
              <li>ul. Kawowa 12, Warszawa</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/40 font-light">
          <p>&copy; {new Date().getFullYear()} Casa Abuela. Wszelkie prawa zastrzeżone.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Polityka Prywatności</a>
            <a href="#" className="hover:text-white transition-colors">Regulamin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
