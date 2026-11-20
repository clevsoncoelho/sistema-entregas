import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/queries";
import NovaEntregaForm from "@/components/NovaEntregaForm";
import type { Product, Profile } from "@/lib/types";
export default async function NovaEntregaPage() { await getCurrentProfile(); const supabase = await createClient(); const [{ data: products }, { data: couriers }] = await Promise.all([supabase.from("products").select("id,sku,name,description,unit,active").eq("active", true).order("name"), supabase.from("profiles").select("id,full_name,email,role,phone,active").eq("role", "motoboy").eq("active", true).order("full_name")]); return <AppShell role="vendedor" title="Nova entrega"><PageHeader eyebrow="Expedição" title="Cadastrar entrega" description="Preencha os dados reais do despacho." /><NovaEntregaForm products={(products ?? []) as Product[]} couriers={(couriers ?? []) as Profile[]} /></AppShell>; }
