import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-serif text-primary mb-8" data-testid="text-privacy-title">Polityka prywatności</h1>

        <div className="space-y-10 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">1. Administrator danych</h2>
            <p>
              Administratorem Twoich danych osobowych jest BlockchainDirect Michał Adamski, ul. Ryszarda Kaczorowskiego 16, 61-695 Poznań, NIP: 9721307756. Pełne dane kontaktowe dostępne są na stronie <Link href="/company" className="underline text-primary">Dane firmy</Link>.
            </p>
            <p className="mt-2">Kontakt w sprawach danych osobowych: kontakt@abuela.casa.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">2. Jakie dane zbieramy</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-primary">Konto użytkownika:</strong> imię, nazwisko, adres e-mail, hasło (zaszyfrowane).</li>
              <li><strong className="text-primary">Zamówienie:</strong> imię i nazwisko, adres e-mail, numer telefonu, dane firmy (opcjonalnie: nazwa, NIP), wybrany punkt odbioru InPost.</li>
              <li><strong className="text-primary">Newsletter:</strong> adres e-mail.</li>
              <li><strong className="text-primary">Pliki cookies:</strong> identyfikatory sesji, preferencje użytkownika.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">3. Cele i podstawy prawne przetwarzania</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-primary">Realizacja umowy sprzedaży</strong> (art. 6 ust. 1 lit. b RODO) – przetwarzanie danych niezbędnych do złożenia i realizacji zamówienia, obsługi konta użytkownika.</li>
              <li><strong className="text-primary">Obowiązek prawny</strong> (art. 6 ust. 1 lit. c RODO) – przechowywanie dokumentacji księgowej i podatkowej zgodnie z przepisami prawa.</li>
              <li><strong className="text-primary">Uzasadniony interes administratora</strong> (art. 6 ust. 1 lit. f RODO) – obsługa reklamacji, dochodzenie roszczeń, zapewnienie bezpieczeństwa usług.</li>
              <li><strong className="text-primary">Zgoda</strong> (art. 6 ust. 1 lit. a RODO) – wysyłka newslettera, cookies analityczne i marketingowe.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">4. Odbiorcy danych</h2>
            <p>Twoje dane mogą być przekazywane następującym podmiotom:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong className="text-primary">Stripe</strong> – operator płatności (przetwarzanie transakcji kartą, BLIK, P24).</li>
              <li><strong className="text-primary">InPost</strong> – operator dostawy (dane odbiorcy przesyłki, punkt paczkomatu).</li>
              <li><strong className="text-primary">Replit / hosting</strong> – dostawca infrastruktury serwerowej.</li>
              <li><strong className="text-primary">Biuro rachunkowe</strong> – obsługa księgowo-podatkowa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">5. Okres przechowywania danych</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Dane związane z zamówieniem – przez okres wymagany przepisami podatkowymi i rachunkowymi (co do zasady 5 lat od końca roku podatkowego).</li>
              <li>Dane konta użytkownika – do momentu usunięcia konta przez użytkownika.</li>
              <li>Dane newslettera – do momentu wycofania zgody (wypisania się).</li>
              <li>Dane z plików cookies – zgodnie z czasem życia poszczególnych cookies (sesyjne: do zamknięcia przeglądarki, trwałe: do 1 roku).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">6. Prawa osoby, której dane dotyczą</h2>
            <p>Przysługuje Ci prawo do:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>dostępu do swoich danych osobowych,</li>
              <li>sprostowania (poprawiania) danych,</li>
              <li>usunięcia danych (prawo do bycia zapomnianym),</li>
              <li>ograniczenia przetwarzania,</li>
              <li>przenoszenia danych,</li>
              <li>wniesienia sprzeciwu wobec przetwarzania,</li>
              <li>cofnięcia zgody w dowolnym momencie (bez wpływu na zgodność z prawem przetwarzania przed cofnięciem).</li>
            </ul>
            <p className="mt-3">
              W celu realizacji powyższych praw skontaktuj się z nami: kontakt@abuela.casa.
            </p>
            <p className="mt-2">
              Masz również prawo wniesienia skargi do organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa, <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer" className="underline text-primary">uodo.gov.pl</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">7. Pliki cookies</h2>
            <p>Strona abuela.casa wykorzystuje pliki cookies:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong className="text-primary">Niezbędne</strong> – wymagane do działania sklepu (sesja użytkownika, koszyk, logowanie). Nie wymagają zgody.</li>
              <li><strong className="text-primary">Analityczne / marketingowe</strong> – używane wyłącznie po uzyskaniu zgody użytkownika. Możesz zmienić swoją decyzję w dowolnym momencie klikając „Ustawienia cookies" w stopce strony.</li>
            </ul>
            <p className="mt-2">
              Możesz również zarządzać cookies przez ustawienia swojej przeglądarki internetowej.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
