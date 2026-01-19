import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    await supabase.auth.signInWithPassword({ email, password });
    location.reload();
  };

  const signup = async () => {
    await supabase.auth.signUp({ email, password });
    alert("Check your email to verify your account.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md p-8 border rounded-2xl shadow-lg bg-card space-y-5">

        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">AI Flow Studio</h2>
          <p className="text-sm text-muted-foreground">
            Login or create your account
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button className="w-full" onClick={login}>
            Login
          </Button>

          <Button className="w-full" variant="outline" onClick={signup}>
            Signup
          </Button>
        </div>

        {/* Info Paragraph */}
        <p className="text-xs text-center text-muted-foreground leading-relaxed">
          This application uses Supabase authentication. Please enter a valid email
          address, complete the email verification process, and then return to log in.
        </p>

      </div>
    </div>
  );
}
