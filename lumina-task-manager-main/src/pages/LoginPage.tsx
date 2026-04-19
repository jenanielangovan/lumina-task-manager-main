import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MOCK_USERS } from "@/data/mockUsers";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate("/dashboard");
    } else {
      toast({ title: "Invalid credentials", description: "Please check your email and password.", variant: "destructive" });
    }
  };

  const quickLogin = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 via-primary to-accent/80 flex-col items-center justify-center p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.3),transparent_70%)]" />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles className="w-12 h-12 text-primary-foreground" />
            <h1 className="text-4xl font-bold text-primary-foreground">Lumina Task</h1>
          </div>
          <p className="text-xl text-primary-foreground/80 font-light">Manage. Collaborate. Deliver.</p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-primary-foreground/60 text-sm">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-primary-foreground">50+</p>
              <p>Teams</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-primary-foreground">10k+</p>
              <p>Tasks</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-primary-foreground">99%</p>
              <p>Uptime</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-1 flex items-center justify-center p-8 bg-background"
      >
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Lumina Task</h1>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium glow-btn disabled:opacity-50 transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>

          {/* Demo Accounts */}
          <div className="glass-card p-4 space-y-2">
            <h3 className="text-sm font-semibold mb-3">Demo Accounts</h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {MOCK_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => quickLogin(u.email, u.password)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent/50 text-left text-sm transition-colors"
                >
                  <div>
                    <span className="font-medium">{u.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{u.email}</span>
                  </div>
                  <RoleBadge role={u.role} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
