import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Reset Password</h1>
        </div>
        {sent ? (
          <div className="glass-card p-6 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-success mx-auto" />
            <h2 className="text-lg font-semibold">Reset link sent!</h2>
            <p className="text-muted-foreground text-sm">Check your email for a password reset link.</p>
            <Link to="/login" className="text-primary hover:underline text-sm inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link.</p>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" required />
            <button type="submit" className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium glow-btn">Send Reset Link</button>
            <Link to="/login" className="text-primary hover:underline text-sm inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
