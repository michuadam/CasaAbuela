import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Błąd logowania");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Zalogowano pomyślnie!");
      setLocation("/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Błąd rejestracji");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Konto utworzone! Jesteś zalogowany.");
      setLocation("/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      registerMutation.mutate({ email, password, firstName, lastName });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-12">
          <Link href="/" className="hover:text-primary transition-colors" data-testid="link-home">
            Strona główna
          </Link>
          <ArrowRight className="h-3 w-3" />
          <span className="text-primary">{isRegister ? "Utwórz konto" : "Zaloguj się"}</span>
        </nav>

        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-4xl text-primary text-center mb-8" data-testid="text-login-title">
            {isRegister ? "Utwórz konto" : "Zaloguj się"}
          </h1>

          <div className="flex border-b border-stone-300 mb-8">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${!isRegister ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
              data-testid="tab-login"
            >
              Logowanie
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${isRegister ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
              data-testid="tab-register"
            >
              Rejestracja
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Imię"
                    className="h-12 px-4 border-stone-300 focus:border-primary bg-white"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nazwisko"
                    className="h-12 px-4 border-stone-300 focus:border-primary bg-white"
                    data-testid="input-last-name"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adres e-mail *"
                required
                className="h-12 px-4 border-stone-300 focus:border-primary bg-white"
                data-testid="input-email"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hasło *"
                required
                minLength={6}
                className="h-12 px-4 pr-20 border-stone-300 focus:border-primary bg-white"
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-primary hover:underline"
                data-testid="button-toggle-password"
              >
                {showPassword ? "Ukryj" : "Pokaż"}
              </button>
            </div>

            {isRegister && (
              <p className="text-xs text-muted-foreground">
                Hasło musi mieć co najmniej 6 znaków.
              </p>
            )}

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white uppercase tracking-widest mt-6"
              data-testid="button-submit"
            >
              {isLoading ? "Proszę czekać..." : (isRegister ? "Utwórz konto" : "Zaloguj się")}
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                {isRegister ? "Masz już konto?" : "Nie masz konta?"}{" "}
                <button 
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-primary underline font-medium"
                  data-testid="link-switch-mode"
                >
                  {isRegister ? "Zaloguj się" : "Załóż je tutaj"}
                </button>
              </p>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do strony głównej
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
