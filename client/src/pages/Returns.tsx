import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Returns() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-serif text-primary mb-8" data-testid="text-returns-title">Zwroty i reklamacje</h1>

        <div className="space-y-10 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">Zwroty (odstąpienie od umowy)</h2>
            <p>Jako konsument masz prawo odstąpić od umowy sprzedaży bez podania przyczyny w terminie <strong className="text-primary">14 dni</strong> od dnia otrzymania towaru.</p>

            <h3 className="font-medium text-primary mt-4 mb-2">Jak zgłosić zwrot?</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Wyślij oświadczenie o odstąpieniu od umowy na adres e-mail: <strong className="text-primary">kontakt@abuela.casa</strong>.</li>
              <li>W wiadomości podaj: numer zamówienia, datę zakupu, imię i nazwisko oraz powód zwrotu (opcjonalnie).</li>
              <li>Spakuj towar w oryginalne lub równoważne opakowanie.</li>
              <li>Odeślij towar na adres:
                <div className="bg-muted/50 p-3 rounded mt-2">
                  <p>BlockchainDirect Michał Adamski</p>
                  <p>ul. Ryszarda Kaczorowskiego 16</p>
                  <p>61-695 Poznań, Polska</p>
                </div>
              </li>
              <li>Towar należy odesłać w terminie 14 dni od dnia złożenia oświadczenia o odstąpieniu.</li>
            </ol>

            <h3 className="font-medium text-primary mt-4 mb-2">Kto ponosi koszt zwrotu?</h3>
            <p>Koszt odesłania towaru ponosi kupujący.</p>

            <h3 className="font-medium text-primary mt-4 mb-2">Zwrot pieniędzy</h3>
            <p>Sprzedawca zwróci wszystkie otrzymane płatności (w tym koszt dostawy) nie później niż w terminie 14 dni od dnia otrzymania oświadczenia o odstąpieniu. Zwrot nastąpi tą samą metodą płatności, której użyto przy zakupie.</p>

            <h3 className="font-medium text-primary mt-4 mb-2">Wyjątki</h3>
            <p>Prawo odstąpienia od umowy nie przysługuje w przypadku towarów, które po otwarciu nie nadają się do zwrotu ze względu na ochronę zdrowia lub higienę (np. otwarte opakowanie kawy).</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">Reklamacje</h2>
            <p>Jeśli otrzymany towar posiada wadę, masz prawo złożyć reklamację na podstawie rękojmi.</p>

            <h3 className="font-medium text-primary mt-4 mb-2">Jak zgłosić reklamację?</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Wyślij zgłoszenie reklamacyjne na adres e-mail: <strong className="text-primary">kontakt@abuela.casa</strong>.</li>
              <li>W zgłoszeniu podaj:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>numer zamówienia,</li>
                  <li>datę zakupu,</li>
                  <li>opis wady towaru,</li>
                  <li>zdjęcia (jeśli dotyczą wady widocznej),</li>
                  <li>oczekiwany sposób rozpatrzenia (naprawa, wymiana, zwrot pieniędzy).</li>
                </ul>
              </li>
            </ol>

            <h3 className="font-medium text-primary mt-4 mb-2">Termin rozpatrzenia</h3>
            <p>Reklamacja zostanie rozpatrzona w terminie <strong className="text-primary">14 dni</strong> od dnia jej otrzymania. O decyzji poinformujemy Cię drogą mailową.</p>

            <h3 className="font-medium text-primary mt-4 mb-2">Rozstrzygnięcie</h3>
            <p>W przypadku uzasadnionej reklamacji sprzedawca – według wyboru kupującego – naprawi wadę, wymieni towar na wolny od wad lub zwróci pieniądze.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-primary mb-3">Kontakt</h2>
            <p>W przypadku pytań dotyczących zwrotów lub reklamacji skontaktuj się z nami:</p>
            <div className="bg-muted/50 p-3 rounded mt-2">
              <p>E-mail: kontakt@abuela.casa</p>
              <p>Telefon: +48 …</p>
              <p>Godziny obsługi: pn–pt 9:00–17:00</p>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
