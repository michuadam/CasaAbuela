import { useState, useEffect } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const handleReset = () => {
      setVisible(true);
    };
    window.addEventListener("resetCookieConsent", handleReset);
    return () => window.removeEventListener("resetCookieConsent", handleReset);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-4 shadow-lg border-t border-white/10"
      data-testid="cookie-banner"
    >
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm font-light leading-relaxed max-w-2xl">
          Używamy plików cookies niezbędnych do działania sklepu. Cookies analityczne i marketingowe uruchamiamy tylko za Twoją zgodą.{" "}
          <a href="/privacy" className="underline hover:text-white" data-testid="link-cookie-privacy">Polityka prywatności</a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-white/30 rounded hover:bg-white/10 transition-colors"
            data-testid="button-cookie-reject"
          >
            Odrzuć
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-white text-primary rounded font-medium hover:bg-white/90 transition-colors"
            data-testid="button-cookie-accept"
          >
            Akceptuj
          </button>
        </div>
      </div>
    </div>
  );
}
