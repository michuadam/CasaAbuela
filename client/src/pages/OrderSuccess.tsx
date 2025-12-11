import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sessionId = params.get("session_id");
    
    if (sessionId) {
      fetch(`/api/order/verify/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2]">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <p className="text-muted-foreground">Weryfikacja płatności...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
            <h1 className="font-serif text-4xl text-primary mb-4">Dziękujemy za zamówienie!</h1>
            <p className="text-lg text-muted-foreground">
              Twoja płatność została potwierdzona. Wkrótce otrzymasz email z potwierdzeniem.
            </p>
          </div>

          {order && (
            <div className="bg-white rounded-lg p-6 mb-8 text-left shadow-sm">
              <h2 className="font-serif text-xl text-primary mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Szczegóły zamówienia
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-muted-foreground">Numer zamówienia</span>
                  <span className="font-mono text-primary">{order.id?.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-muted-foreground">Imię i nazwisko</span>
                  <span className="text-primary">{order.customerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-primary">{order.customerEmail}</span>
                </div>
                {order.inpostPointName && (
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-muted-foreground">Paczkomat</span>
                    <span className="text-primary">{order.inpostPointId}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 pt-4">
                  <span className="font-medium text-primary">Wartość zamówienia</span>
                  <span className="font-bold text-primary text-lg">{order.totalAmount} PLN</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Otrzymasz powiadomienie SMS gdy paczka będzie gotowa do odbioru w paczkomacie.
            </p>
            
            <Button 
              onClick={() => setLocation("/")}
              className="bg-primary hover:bg-primary/90 text-white h-12 px-8"
              data-testid="button-continue-shopping"
            >
              Kontynuuj zakupy <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
