import Link from "next/link";
import { Plus, Search } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import DeliveryCard from "@/components/DeliveryCard";
import { demoDeliveries } from "@/lib/demo-data";

export default function VendedorPage() {
  return <AppShell role="vendedor" title="Minhas entregas"><PageHeader eyebrow="Vendedor" title="Minhas entregas" description="Acompanhe os despachos criados por você." action={<Link href="/vendedor/nova" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"><Plus size={18} /> Nova entrega</Link>} /><div className="mb-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-blue-600 p-4 text-white"><p className="text-sm text-blue-100">Total no período</p><p className="mt-2 text-3xl font-bold">{demoDeliveries.length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Em andamento</p><p className="mt-2 text-3xl font-bold text-slate-900">2</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Entregues</p><p className="mt-2 text-3xl font-bold text-emerald-600">1</p></div></div><div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><Search size={18} className="text-slate-400" /><input placeholder="Buscar por cliente, código ou documento" className="w-full text-sm outline-none" /></div><div className="grid gap-4 lg:grid-cols-2">{demoDeliveries.map((delivery) => <DeliveryCard key={delivery.id} delivery={delivery} />)}</div></AppShell>;
}
