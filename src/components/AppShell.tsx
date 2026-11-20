"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import {
  LayoutDashboard, PlusCircle, Package, Truck, Users,
  ClipboardList, LogOut, Menu, X
} from "lucide-react";
import { useState, type ReactNode } from "react";

type Props = { role: "vendedor" | "motoboy" | "admin"; title: string; children: ReactNode };

const menus = {
  vendedor: [
    { href: "/vendedor", label: "Minhas Entregas", icon: ClipboardList },
    { href: "/vendedor/nova", label: "Nova Entrega", icon: PlusCircle },
    { href: "/vendedor/produtos", label: "Produtos", icon: Package },
  ],
  motoboy: [
    { href: "/motoboy", label: "Minhas Entregas", icon: Truck },
  ],
  admin: [
    { href: "/admin", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/admin/entregas", label: "Entregas", icon: ClipboardList },
    { href: "/admin/produtos", label: "Produtos", icon: Package },
    { href: "/admin/usuarios", label: "Usuários", icon: Users },
  ],
};

export default function AppShell({ role, title, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await createClient().auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] md:grid md:grid-cols-[240px_1fr]">
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed z-40 inset-y-0 left-0 w-[240px] bg-[#17233b] text-white transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2 font-bold"><Truck size={22} /> Logística</div>
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu"><X /></button>
        </div>
        <nav className="space-y-1 p-3">
          {menus[role].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10"}`}>
                <Icon size={19} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="absolute bottom-5 left-3 right-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/10">
          <LogOut size={19} /> Sair
        </button>
      </aside>
      {open && <button className="fixed inset-0 z-30 bg-black/30 md:hidden" aria-label="Fechar menu" onClick={() => setOpen(false)} />}
      <main className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 md:px-7">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu /></button>
            <h1 className="text-base font-bold text-slate-800 md:text-lg">{title}</h1>
          </div>
          <button onClick={logout} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
            <LogOut size={16} /><span className="hidden sm:inline">Sair</span>
          </button>
        </header>
        <div className="p-4 md:p-7">{children}</div>
      </main>
    </div>
  );
}
