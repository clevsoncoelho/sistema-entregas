import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import DeliveryCard from "@/components/DeliveryCard";
import { demoDeliveries } from "@/lib/demo-data";
export default function AdminEntregasPage() { return <AppShell role="admin" title="Entregas"><PageHeader eyebrow="Operação" title="Gestão de entregas" description="Filtre, acompanhe e reatribua os despachos." action={<select className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-600"><option>Todos os status</option><option>Aguardando coleta</option><option>Em rota</option><option>Entregue</option><option>Ocorrência</option></select>} /><div className="grid gap-4 lg:grid-cols-2">{demoDeliveries.map((delivery) => <DeliveryCard key={delivery.id} delivery={delivery} />)}</div></AppShell>; }
