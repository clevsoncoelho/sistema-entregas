import Link from "next/link";
import { Plus, Search } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import DeliveryCard from "@/components/DeliveryCard";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/queries";
import type { Delivery } from "@/lib/types";

export default async function VendedorPage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data } = await supabase.from("deliveries").select("*, courier:profiles!deliveries_courier_id_fkey(id,full_name,email,role,phone,active)").eq("seller_id", profile.id).order("created_at", { ascending: false });
  const deliveries = (data ?? []) as Delivery[];
  const active = deliveries.filter((d) => ["aguardando_coleta", "em_rota"].includes(d.status)).length;
  const delivered = deliveries.filter((d) => d.status === "entregue").length;
  return <AppShell role="vendedor" title="Minhas entregas"><PageHeader eyebrow="Vendedor" title="Minhas entregas" description="Acompanhe os despachos criados por você." action={<Link href="/vendedor/nova" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"><Plus size={18} /> Nova entrega</Link>} /><div className="mb-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-blue-600 p-4 text-white"><p className="text-sm text-blue-100">Total</p><p className="mt-2 text-3xl font-bold">{deliveries.length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Em andamento</p><p className="mt-2 text-3xl font-bold text-slate-900">{active}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Entregues</p><p className="mt-2 text-3xl font-bold text-emerald-600">{delivered}</p></div></div><div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><Search size={18} className="text-slate-400" /><input placeholder="Buscar por cliente, código ou documento" className="w-full text-sm outline-none" /></div>{deliveries.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">Nenhuma entrega cadastrada ainda.</div> : <div className="grid gap-4 lg:grid-cols-2">{deliveries.map((delivery) => <DeliveryCard key={delivery.id} delivery={delivery} />)}</div>}</AppShell>;
}
