import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle, Package, ArrowRight, Loader2, AlertCircle, MapPin, ShoppingBag } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  paid: "Opłacone",
  awaiting_payment: "Oczekuje na płatność",
  shipped: "Wysłane",
  cancelled: "Anulowane",
};

interface OrderItem {
  title: string;
  quantity: number;
  unitPrice: string;
  price?: string;
}

function parseItems(items: string | undefined): OrderItem[] {
  if (!items) return [];
  try {
    const parsed = JSON.parse(items);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: any) => ({
      title: item.title || item.name || "Produkt",
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || item.price || "0",
    }));
  } catch {
    return [];
  }
}

export default function OrderSuccess() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [pollExhausted, setPollExhausted] = useState(false);
  const pollCount = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sessionId = new URLSearchParams(search).get("session_id");

  const verify = useCallback(async (sid: string) => {
    const res = await fetch(`/api/order/verify/${sid}`);
    if (!res.ok) throw new Error("Błąd serwera");
    return res.json();
  }, []);

  const startPolling = useCallback((sid: string) => {
    setPolling(true);
    pollCount.current = 0;

    const poll = async () => {
      pollCount.current++;
      try {
        const data = await verify(sid);
        if (data.success && data.order) {
          setOrder(data.order);
          setPolling(false);
          return;
        }
      } catch {
        if (pollCount.current >= 5) {
          setPolling(false);
          setError("Nie udało się zweryfikować płatności. Spróbuj odświeżyć stronę.");
          return;
        }
      }

      if (pollCount.current >= 5) {
        setPolling(false);
        setPollExhausted(true);
        return;
      }
      pollTimer.current = setTimeout(poll, 3000);
    };

    pollTimer.current = setTimeout(poll, 3000);
  }, [verify]);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    verify(sessionId)
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          startPolling(sessionId);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Nie udało się zweryfikować płatności.");
        setLoading(false);
      });

    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [sessionId, verify, startPolling]);

  const handleRetry = () => {
    if (!sessionId) return;
    setError(null);
    setLoading(true);
    setPollExhausted(false);
    verify(sessionId)
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          startPolling(sessionId);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Nie udało się zweryfikować płatności.");
        setLoading(false);
      });
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-32 pb-16 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-primary mb-4" data-testid="text-no-session">Brak identyfikatora płatności</h1>
          <p className="text-muted-foreground mb-8">Nie znaleźliśmy danych dotyczących płatności. Jeśli właśnie złożyłeś zamówienie, sprawdź swoją skrzynkę e-mail.</p>
          <Button onClick={() => setLocation("/")} className="bg-primary hover:bg-primary/90 text-white h-12 px-8" data-testid="button-back-to-shop">
            Wróć do sklepu <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-32 pb-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground" data-testid="text-loading">Weryfikacja płatności…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-32 pb-16 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-primary mb-4" data-testid="text-error">Wystąpił błąd</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={handleRetry} className="bg-primary hover:bg-primary/90 text-white h-12 px-8" data-testid="button-retry">
            Spróbuj ponownie
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (polling) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-32 pb-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-primary mb-4" data-testid="text-processing">Płatność jest przetwarzana…</h1>
          <p className="text-muted-foreground">Czekamy na potwierdzenie. To może potrwać kilka sekund.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (pollExhausted && !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-32 pb-16 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-primary mb-4" data-testid="text-poll-exhausted">Płatność w trakcie przetwarzania</h1>
          <p className="text-muted-foreground mb-8">
            Jeśli środki zostały pobrane, odśwież stronę za chwilę lub skontaktuj się z nami: <strong>kontakt@abuela.casa</strong>
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleRetry} variant="outline" className="h-12 px-8" data-testid="button-retry-poll">
              Odśwież
            </Button>
            <Button onClick={() => setLocation("/")} className="bg-primary hover:bg-primary/90 text-white h-12 px-8" data-testid="button-back-to-shop">
              Wróć do sklepu
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const items = parseItems(order?.items);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
            <h1 className="font-serif text-4xl text-primary mb-3" data-testid="text-order-success">Dziękujemy! Zamówienie przyjęte</h1>
            <p className="text-muted-foreground text-lg">Potwierdzenie zostało wysłane na Twój adres e-mail.</p>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="font-serif text-xl text-primary mb-4 flex items-center gap-2" data-testid="text-details-heading">
              <Package className="h-5 w-5" />
              Szczegóły zamówienia
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-muted-foreground">Numer zamówienia</span>
                <span className="font-mono text-primary" data-testid="text-order-id">{order.id?.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-muted-foreground">Status</span>
                <span className="text-primary font-medium" data-testid="text-order-status">{STATUS_LABELS[order.status] || order.status}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="font-serif text-xl text-primary mb-4 flex items-center gap-2" data-testid="text-products-heading">
              <ShoppingBag className="h-5 w-5" />
              Produkty
            </h2>
            <div className="space-y-3 text-sm">
              {items.length > 0 ? items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-stone-100 last:border-0" data-testid={`text-order-item-${i}`}>
                  <div>
                    <span className="text-primary">{item.title}</span>
                    <span className="text-muted-foreground ml-2">× {item.quantity}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground text-xs mr-3">{item.unitPrice} PLN/szt.</span>
                    <span className="text-primary font-medium">{(parseFloat(item.unitPrice) * item.quantity).toFixed(2)} PLN</span>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground py-2">Szczegóły produktów znajdziesz w e-mailu z potwierdzeniem.</p>
              )}
              <div className="flex justify-between pt-3 border-t border-stone-100">
                <span className="font-medium text-primary">Razem</span>
                <span className="font-bold text-primary text-lg" data-testid="text-order-total">{order.totalAmount} PLN</span>
              </div>
            </div>
          </div>

          {(order.inpostPointName || order.inpostPointAddress) && (
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h2 className="font-serif text-xl text-primary mb-4 flex items-center gap-2" data-testid="text-delivery-heading">
                <MapPin className="h-5 w-5" />
                Dostawa – InPost Paczkomat
              </h2>
              <div className="text-sm text-muted-foreground space-y-1">
                {order.inpostPointName && <p className="text-primary font-medium" data-testid="text-inpost-name">{order.inpostPointName}</p>}
                {order.inpostPointAddress && <p data-testid="text-inpost-address">{order.inpostPointAddress}</p>}
              </div>
            </div>
          )}

          <div className="bg-primary/5 rounded-lg p-6 mb-8 border border-primary/10">
            <h2 className="font-serif text-lg text-primary mb-2" data-testid="text-next-steps-heading">Co dalej?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Przygotujemy Twoją paczkę z najświeższą kawą. Gdy zamówienie zostanie nadane, otrzymasz e-mail z informacją o wysyłce. Paczka trafi do wybranego paczkomatu InPost w ciągu 2–4 dni roboczych.
            </p>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setLocation("/")}
              className="bg-primary hover:bg-primary/90 text-white h-12 px-8"
              data-testid="button-back-to-shop"
            >
              Wróć do sklepu <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
