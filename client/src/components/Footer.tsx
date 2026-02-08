import type { MouseEvent } from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  const handleResetCookies = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem("cookieConsent");
    window.dispatchEvent(new Event("resetCookieConsent"));
  };

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
              <li>kontakt@abuela.casa</li>
              <li>+48 …</li>
              <li>ul. Ryszarda Kaczorowskiego 16, Poznań</li>
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
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
            <a href="/terms" className="hover:text-white transition-colors" data-testid="link-terms">Regulamin</a>
            <a href="/privacy" className="hover:text-white transition-colors" data-testid="link-privacy">Polityka prywatności</a>
            <a href="/returns" className="hover:text-white transition-colors" data-testid="link-returns">Zwroty</a>
            <a href="/company" className="hover:text-white transition-colors" data-testid="link-company">Dane firmy</a>
            <a
              href="#"
              onClick={handleResetCookies}
              className="hover:text-white transition-colors"
              data-testid="link-cookie-settings"
            >
              Ustawienia cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
