import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-12">
          <Link href="/" className="hover:text-primary transition-colors" data-testid="link-home">
            Strona główna
          </Link>
          <ArrowRight className="h-3 w-3" />
          <span className="text-primary">Zaloguj się do swojego konta</span>
        </nav>

        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-4xl text-primary text-center mb-12" data-testid="text-login-title">
            Zaloguj się do swojego konta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adres e-mail"
                  className="h-14 px-4 border-stone-300 focus:border-primary bg-white"
                  data-testid="input-login-email"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Hasło"
                  className="h-14 px-4 pr-20 border-stone-300 focus:border-primary bg-white"
                  data-testid="input-login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-sm text-primary hover:underline"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? "Ukryj" : "Pokaż"}
                </button>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">*</span> Te pola są wymagane
            </p>

            <div className="text-center">
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-primary"
                data-testid="link-forgot-password"
              >
                Nie pamiętasz hasła? <span className="underline">Kliknij tutaj</span>
              </a>
            </div>

            <Button 
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white uppercase tracking-widest"
              data-testid="button-login-submit"
            >
              Zaloguj się
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Nie masz konta?{" "}
                <a 
                  href="/api/login" 
                  className="text-primary underline font-medium"
                  data-testid="link-register"
                >
                  Załóż je tutaj
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
