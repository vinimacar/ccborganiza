import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Church, Mail, Lock, Chrome } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao CCB Organiza",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast({
          title: "Conta criada com sucesso!",
          description: "Você já está logado",
        });
      } else {
        await signInWithEmail(email, password);
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta",
        });
      }
      navigate("/");
    } catch (error: any) {
      let errorMessage = "Tente novamente mais tarde";
      
      if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha deve ter pelo menos 6 caracteres";
      }

      toast({
        title: isSignUp ? "Erro ao criar conta" : "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Church className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">CCB Organiza</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Crie sua conta para começar"
              : "Faça login para acessar o sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Login com Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continuar com Google
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              OU
            </span>
          </div>

          {/* Login com Email */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Carregando..."
                : isSignUp
                ? "Criar Conta"
                : "Entrar"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
              disabled={loading}
            >
              {isSignUp
                ? "Já tem uma conta? Fazer login"
                : "Não tem uma conta? Criar conta"}
            </button>
          </div>

          {!isSignUp && (
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-primary hover:underline"
              >
                Continuar sem login
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
