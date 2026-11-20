"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Truck, Mail, Lock, LoaderCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    const role = profile?.role ?? "vendedor";
    router.replace(role === "admin" ? "/admin" : role === "motoboy" ? "/motoboy" : "/vendedor");
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe,#f8fafc_55%)] p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200"><Truck size={30} /></div>
          <h1 className="text-2xl font-bold text-slate-900">Logística Entregas</h1>
          <p className="mt-1 text-sm text-slate-500">Acesse sua conta operacional</p>
        </div>
        <form onSubmit={login} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">E-mail
            <div className="mt-1.5 flex items-center rounded-lg border border-slate-300 bg-white px-3 focus-within:border-blue-500">
              <Mail size={18} className="text-slate-400" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="seu@email.com" className="h-11 w-full px-3 text-sm outline-none" />
            </div>
          </label>
          <label className="block text-sm font-semibold text-slate-700">Senha
            <div className="mt-1.5 flex items-center rounded-lg border border-slate-300 bg-white px-3 focus-within:border-blue-500">
              <Lock size={18} className="text-slate-400" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Sua senha" className="h-11 w-full px-3 text-sm outline-none" />
            </div>
          </label>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {loading ? <LoaderCircle className="animate-spin" /> : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
