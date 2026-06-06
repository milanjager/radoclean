import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Check if user has admin role
      const { data: roles } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });
      
      if (roles) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isResetPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Email odeslán",
          description: "Zkontrolujte svůj email pro obnovení hesla",
        });
        setIsResetPassword(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Úspěch",
          description: "Úspěšně přihlášen",
        });
        
        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: isAdmin } = await supabase.rpc('has_role', {
            _user_id: user.id,
            _role: 'admin'
          });
          
          navigate(isAdmin ? "/admin" : "/dashboard");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Úspěch",
          description: "Účet byl vytvořen",
        });
      }
    } catch (error: any) {
      toast({
        title: "Chyba",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {isResetPassword ? "Obnovit heslo" : isLogin ? "Přihlášení" : "Registrace"}
          </CardTitle>
          <CardDescription>
            {isResetPassword
              ? "Zadejte svůj email pro obnovení hesla"
              : isLogin
              ? "Přihlaste se ke svému účtu"
              : "Vytvořte si nový účet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isResetPassword && (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full mb-4"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    const result = await lovable.auth.signInWithOAuth("google", {
                      redirect_uri: window.location.origin + "/auth",
                    });
                    if (result.error) throw result.error;
                    if (result.redirected) return;
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                      const { data: isAdmin } = await supabase.rpc("has_role", {
                        _user_id: user.id,
                        _role: "admin",
                      });
                      navigate(isAdmin ? "/admin" : "/dashboard");
                    }
                  } catch (error: any) {
                    toast({
                      title: "Chyba",
                      description: error?.message || "Přihlášení přes Google selhalo",
                      variant: "destructive",
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Přihlásit se přes Google
              </Button>
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">nebo email</span>
                </div>
              </div>
            </>
          )}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vas@email.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {!isResetPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Heslo</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Načítání..."
                : isResetPassword
                ? "Odeslat email"
                : isLogin
                ? "Přihlásit se"
                : "Registrovat"}
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-center text-sm">
            {!isResetPassword && (
              <>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline block w-full"
                >
                  {isLogin
                    ? "Nemáte účet? Zaregistrujte se"
                    : "Již máte účet? Přihlaste se"}
                </button>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setIsResetPassword(true)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Zapomenuté heslo?
                  </button>
                )}
              </>
            )}
            {isResetPassword && (
              <button
                type="button"
                onClick={() => setIsResetPassword(false)}
                className="text-primary hover:underline"
              >
                Zpět na přihlášení
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;