import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import DeliveryCard from "@/components/DeliveryCard";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/queries";
export const instant = false;
import type { Delivery } from "@/lib/types";
export default async function AdminEntregasPage() { await getCurrentProfile(); const supabase = await createClient(); const { data } = await supabase.from("deliveries").select("*, courier:profiles!deliveries_courier_id_fkey(id,full_name,email,role,phone,active), seller:profiles!deliveries_seller_id_fkey(id,full_name,email,role,phone,active)").order("created_at", { ascending: false }); const deliveries = (data ?? []) as Delivery[]; return <AppShell role="admin" title="Entregas"><PageHeader eyebrow="Operação" title="Gestão de entregas" description="Filtre, acompanhe e reatribua os despachos." action={<select className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-600"><option>Todos os status</option><option>Aguardando coleta</option><option>Em rota</option><option>Entregue</option><option>Ocorrência</option></select>} />{deliveries.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">Nenhuma entrega cadastrada.</div> : <div className="grid gap-4 lg:grid-cols-2">{deliveries.map((delivery) => <DeliveryCard key={delivery.id} delivery={delivery} />)}</div>}</AppShell>; }
