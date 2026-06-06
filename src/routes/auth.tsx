import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar · Manjar do Ramos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Email inválido").max(255);
const passwordSchema = z.string().min(8, "Mínimo 8 caracteres").max(72);
const nameSchema = z.string().trim().min(1, "Indique o nome").max(120);

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const redirectTo = params.get("redirect") || "/minhas-encomendas";

  useEffect(() => {
    if (!loading && user) navigate({ to: redirectTo });
  }, [user, loading, navigate, redirectTo]);

  return (
    <div className="bg-background">
      <Navbar />
      <main className="min-h-[80vh] pt-32 pb-20">
        <div className="mx-auto w-full max-w-md px-5">
          <h1 className="font-serif text-4xl text-espresso text-center">
            Bem-vindo
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Aceda à sua conta ou crie uma para finalizar a encomenda.
          </p>

          <Tabs defaultValue="login" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              const res = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin + "/auth",
              });
              if (res.error) toast.error("Não foi possível entrar com Google.");
            }}
          >
            Continuar com Google
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-wine">← Voltar ao site</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ep = emailSchema.safeParse(email);
    const pp = passwordSchema.safeParse(password);
    if (!ep.success) return toast.error(ep.error.issues[0].message);
    if (!pp.success) return toast.error(pp.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: ep.data,
      password: pp.data,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Sessão iniciada.");
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Palavra-passe</Label>
        <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-wine text-cream hover:bg-wine/90">
        {busy ? "A entrar…" : "Entrar"}
      </Button>
    </form>
  );
}

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const np = nameSchema.safeParse(name);
    const ep = emailSchema.safeParse(email);
    const pp = passwordSchema.safeParse(password);
    if (!np.success) return toast.error(np.error.issues[0].message);
    if (!ep.success) return toast.error(ep.error.issues[0].message);
    if (!pp.success) return toast.error(pp.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: ep.data,
      password: pp.data,
      options: {
        emailRedirectTo: window.location.origin + "/auth",
        data: { name: np.data, role: "customer" },
      },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Conta criada! Sessão iniciada.");
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Nome</Label>
        <Input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Palavra-passe</Label>
        <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required minLength={8} />
        <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-wine text-cream hover:bg-wine/90">
        {busy ? "A criar…" : "Criar conta"}
      </Button>
    </form>
  );
}