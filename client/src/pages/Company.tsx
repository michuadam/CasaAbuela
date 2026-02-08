import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Company() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-serif text-primary mb-8" data-testid="text-company-title">Dane firmy</h1>

        <section className="mb-10">
          <h2 className="text-xl font-serif text-primary mb-4">Sprzedawca</h2>
          <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
            <p><strong className="text-primary">Nazwa:</strong> BlockchainDirect Michał Adamski</p>
            <p><strong className="text-primary">Adres:</strong> ul. Ryszarda Kaczorowskiego 16, 61-695 Poznań, Polska</p>
            <p><strong className="text-primary">NIP:</strong> 9721307756</p>
            <p><strong className="text-primary">REGON:</strong> 38590466000000</p>
            <p><strong className="text-primary">Wpis do rejestru (KRS):</strong> Nie dotyczy (działalność jednoosobowa)</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-serif text-primary mb-4">Kontakt i obsługa klienta</h2>
          <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
            <p><strong className="text-primary">E-mail:</strong> kontakt@abuela.casa</p>
            <p><strong className="text-primary">Telefon:</strong> +48 …</p>
            <p><strong className="text-primary">Godziny obsługi:</strong> pn–pt 9:00–17:00</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-serif text-primary mb-4">Informacje dodatkowe</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sklep internetowy Casa Abuela prowadzony jest przez BlockchainDirect Michał Adamski z siedzibą w Poznaniu. Sprzedajemy kawę kolumbijską z rodzinnej plantacji w regionie Huila, Kolumbia. Działamy zgodnie z polskim prawem konsumenckim i przepisami Unii Europejskiej.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
