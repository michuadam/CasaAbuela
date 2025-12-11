import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    easyPackAsyncInit?: () => void;
    easyPack?: any;
  }
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cartItems, cartTotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [geowidgetLoaded, setGeowidgetLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://geowidget.inpost.pl/inpost-geowidget.js';
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://geowidget.inpost.pl/inpost-geowidget.css';
    document.head.appendChild(link);

    script.onload = () => {
      setGeowidgetLoaded(true);
    };

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openGeowidget = () => {
    if (window.easyPack) {
      window.easyPack.modalMap((point: any) => {
        setSelectedPoint(point);
      }, { width: 500, height: 600 });
    } else {
      const modal = document.createElement('div');
      modal.id = 'inpost-geowidget-modal';
      modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
          <div style="background: white; width: 90%; max-width: 800px; height: 80%; border-radius: 8px; overflow: hidden; position: relative;">
            <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 10px; z-index: 10; background: #333; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
            <inpost-geowidget 
              onpoint="window.handleInpostPoint" 
              token="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwMzM2MDM0MjksImlhdCI6MTcxODI0MzQyOSwianRpIjoiMzY2NDlkNjEtNTQ1Zi00ZGQ1LWI5MjItZWY5ODg2MmQzYzNkIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpwb2ludHNfYXBpIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicG9pbnRzLWFwaSIsInNlc3Npb25fc3RhdGUiOiJmNTg1NWRiYS0wMjJkLTRhYjAtODRkMC0zODQ1OWNhMDU3NjUiLCJzY29wZSI6Im9wZW5pZCBhcGk6cG9pbnRzIiwic2lkIjoiZjU4NTVkYmEtMDIyZC00YWIwLTg0ZDAtMzg0NTljYTA1NzY1IiwiYWxsb3dlZF9yZWZlcnJlcnMiOiIifQ.dFu8hW0P2RhP2AERmQ6B4nRXxGXxTBgMQG_j80oHZaM"
              language="pl"
              config="parcelcollect"
            ></inpost-geowidget>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      (window as any).handleInpostPoint = (point: any) => {
        setSelectedPoint(point.detail);
        modal.remove();
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast.error("Proszę wypełnić wszystkie pola");
      return;
    }

    if (!selectedPoint) {
      toast.error("Proszę wybrać paczkomat");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          inpostPointId: selectedPoint.name,
          inpostPointName: selectedPoint.address?.line1 || selectedPoint.name,
          inpostPointAddress: `${selectedPoint.address?.line1 || ''}, ${selectedPoint.address?.line2 || ''}`,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Nie udało się utworzyć sesji płatności");
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas przetwarzania zamówienia");
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F7F2]">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="font-serif text-3xl text-primary mb-4">Twój koszyk jest pusty</h1>
          <p className="text-muted-foreground mb-8">Dodaj produkty do koszyka, aby kontynuować</p>
          <Button onClick={() => setLocation("/")} className="bg-primary hover:bg-primary/90">
            Wróć do sklepu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="mb-8 text-primary hover:text-primary/80"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Powrót do sklepu
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-3xl text-primary mb-2">Dane do wysyłki</h1>
              <p className="text-muted-foreground">Wypełnij formularz, aby kontynuować</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Imię i nazwisko</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Jan Kowalski"
                    className="mt-1"
                    data-testid="input-customer-name"
                  />
                </div>

                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="jan@example.com"
                    className="mt-1"
                    data-testid="input-customer-email"
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone">Telefon</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="+48 123 456 789"
                    className="mt-1"
                    data-testid="input-customer-phone"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="font-serif text-xl text-primary mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Punkt odbioru InPost
                </h2>
                
                {selectedPoint ? (
                  <div className="bg-white p-4 rounded-lg border border-stone-200 mb-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-primary">{selectedPoint.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedPoint.address?.line1}, {selectedPoint.address?.line2}
                        </p>
                      </div>
                    </div>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={openGeowidget}
                      className="mt-3 w-full"
                      data-testid="button-change-point"
                    >
                      Zmień paczkomat
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={openGeowidget}
                    className="w-full h-20 border-dashed"
                    data-testid="button-select-point"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Wybierz paczkomat
                  </Button>
                )}
              </div>

              <Button 
                type="submit"
                disabled={isLoading || !selectedPoint}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white uppercase tracking-widest"
                data-testid="button-pay"
              >
                {isLoading ? "Przetwarzanie..." : `Zapłać ${(cartTotal + 14.99).toFixed(2)} PLN`}
              </Button>
            </form>
          </div>

          <div className="lg:pl-8 lg:border-l border-stone-200">
            <h2 className="font-serif text-xl text-primary mb-6">Podsumowanie zamówienia</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex gap-4 py-3 border-b border-stone-100">
                  <div className="w-16 h-16 bg-white rounded flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/Gemini_Generated_Image_49qvov49qvov49qv_1765237897906.png" 
                      alt={item.product?.title}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-primary">{item.product?.title} {item.product?.weight}</p>
                    <p className="text-sm text-muted-foreground">Ilość: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-primary">
                    {(parseFloat(item.product?.price || '0') * item.quantity).toFixed(2)} PLN
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-200">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Produkty</span>
                <span className="text-primary">{cartTotal.toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dostawa (InPost)</span>
                <span className="text-primary">14.99 PLN</span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-3 border-t border-stone-200">
                <span className="text-primary">Razem</span>
                <span className="text-primary">{(cartTotal + 14.99).toFixed(2)} PLN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
