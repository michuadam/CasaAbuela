import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-serif text-primary mb-8" data-testid="text-terms-title">Regulamin sklepu internetowego Casa Abuela</h1>

        <div className="space-y-10 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">§1. Postanowienia ogólne</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Niniejszy regulamin określa zasady korzystania ze sklepu internetowego Casa Abuela, dostępnego pod adresem abuela.casa.</li>
              <li>Sprzedawcą jest BlockchainDirect Michał Adamski, ul. Ryszarda Kaczorowskiego 16, 61-695 Poznań, NIP: 9721307756, REGON: 38590466000000. Pełne dane firmy dostępne są na stronie <Link href="/company" className="underline text-primary">Dane firmy</Link>.</li>
              <li>Kontakt ze sprzedawcą: e-mail kontakt@abuela.casa, telefon +48 …, godziny obsługi pn–pt 9:00–17:00.</li>
              <li>Regulamin jest udostępniany nieodpłatnie i w formie umożliwiającej jego pobranie, utrwalenie oraz wydrukowanie.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">§2. Składanie zamówień</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Zamówienia można składać za pośrednictwem strony internetowej abuela.casa, 24 godziny na dobę, 7 dni w tygodniu.</li>
              <li>Aby złożyć zamówienie, należy dodać produkty do koszyka, wybrać punkt odbioru InPost Paczkomat, podać dane do dostawy (imię, e-mail, telefon) i przejść do płatności.</li>
              <li>Zamówienia mogą składać osoby fizyczne (klienci indywidualni) oraz firmy (z podaniem nazwy firmy i NIP).</li>
              <li>Potwierdzenie zamówienia następuje po pomyślnym opłaceniu – klient otrzymuje wiadomość e-mail z potwierdzeniem.</li>
              <li>Umowa sprzedaży zostaje zawarta z chwilą potwierdzenia przyjęcia zamówienia do realizacji przez sprzedawcę.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">§3. Ceny i płatności</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Wszystkie ceny podane w sklepie są cenami brutto (zawierają podatek VAT) i wyrażone w złotych polskich (PLN).</li>
              <li>Płatności obsługuje operator Stripe. Dostępne metody płatności: karta płatnicza, BLIK, Przelewy24 (P24).</li>
              <li>Płatność jest wymagana w momencie składania zamówienia.</li>
              <li>Sprzedawca zastrzega sobie prawo do zmiany cen produktów, przy czym zmiana nie dotyczy zamówień już złożonych.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">§4. Dostawa</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Dostawa realizowana jest za pośrednictwem sieci paczkomatów InPost na terenie Polski.</li>
              <li>Koszt dostawy wynosi 14,99 PLN. Przy zamówieniach o wartości 160 PLN lub wyższej dostawa jest bezpłatna.</li>
              <li>Przewidywany czas dostawy wynosi 2–4 dni robocze od momentu opłacenia zamówienia.</li>
              <li>Klient zostanie powiadomiony e-mailem o wysłaniu przesyłki.</li>
              <li>Klient jest zobowiązany do odebrania przesyłki z paczkomatu w wyznaczonym terminie.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">§5. Odstąpienie od umowy</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Konsument ma prawo odstąpić od umowy sprzedaży bez podania przyczyny w terminie 14 dni od dnia otrzymania towaru.</li>
              <li>Aby skorzystać z prawa odstąpienia, należy poinformować sprzedawcę o swojej decyzji drogą mailową na adres kontakt@abuela.casa.</li>
              <li>Towar należy odesłać na adres: BlockchainDirect Michał Adamski, ul. Ryszarda Kaczorowskiego 16, 61-695 Poznań, w terminie 14 dni od dnia złożenia oświadczenia o odstąpieniu.</li>
              <li>Koszt odesłania towaru ponosi kupujący.</li>
              <li>Sprzedawca zwróci wszystkie otrzymane płatności (w tym koszt dostawy) nie później niż w terminie 14 dni od dnia otrzymania oświadczenia o odstąpieniu.</li>
              <li>Prawo odstąpienia nie przysługuje w przypadku towarów, które po otwarciu nie nadają się do zwrotu ze względu na ochronę zdrowia lub higienę (np. otwarte opakowanie kawy).</li>
              <li>Szczegóły procedury zwrotów znajdują się na stronie <Link href="/returns" className="underline text-primary">Zwroty i reklamacje</Link>.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">§6. Reklamacje</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Sprzedawca odpowiada za wady towaru na podstawie przepisów o rękojmi (Kodeks cywilny).</li>
              <li>Reklamację można zgłosić drogą mailową na adres kontakt@abuela.casa, podając opis wady, datę zakupu oraz oczekiwany sposób rozpatrzenia.</li>
              <li>Sprzedawca rozpatrzy reklamację w terminie 14 dni od dnia jej otrzymania.</li>
              <li>W przypadku uzasadnionej reklamacji sprzedawca naprawi wadę, wymieni towar lub zwróci pieniądze.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">§7. Dane osobowe i cookies</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Administratorem danych osobowych jest BlockchainDirect Michał Adamski.</li>
              <li>Dane osobowe przetwarzane są w celu realizacji zamówień, obsługi konta oraz w celach marketingowych (za zgodą).</li>
              <li>Szczegółowe informacje o przetwarzaniu danych osobowych i wykorzystaniu plików cookies znajdują się w <Link href="/privacy" className="underline text-primary">Polityce prywatności</Link>.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">§8. Postanowienia końcowe</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Regulamin wchodzi w życie z dniem 1 stycznia 2026 r.</li>
              <li>Sprzedawca zastrzega sobie prawo do zmiany regulaminu. Zmiany nie dotyczą zamówień złożonych przed ich wejściem w życie.</li>
              <li>W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego i ustawy o prawach konsumenta.</li>
              <li>Ewentualne spory będą rozstrzygane przez sąd właściwy dla siedziby sprzedawcy, z zastrzeżeniem prawa konsumenta do wyboru sądu właściwego dla swojego miejsca zamieszkania.</li>
            </ol>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
