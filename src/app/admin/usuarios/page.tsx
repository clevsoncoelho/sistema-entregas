import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/queries";
import type { Profile } from "@/lib/types";
import AdminUserForm from "@/components/AdminUserForm";
export const instant = false;
const labels = { admin: "Administrativo", vendedor: "Vendedor", motoboy: "Motoboy" };
export default async function AdminUsuariosPage() { await getCurrentProfile(); const supabase = await createClient(); const { data } = await supabase.from("profiles").select("id,full_name,email,role,phone,active").order("full_name"); const profiles = (data ?? []) as Profile[]; return <AppShell role="admin" title="Usuários"><PageHeader eyebrow="Acessos" title="Usuários e perfis" description="O administrativo é responsável por cadastrar todos os acessos." action={<AdminUserForm />} /><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{profiles.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">Nenhum perfil cadastrado.</p> : profiles.map((profile) => <div key={profile.id} className="flex flex-col gap-3 border-b border-slate-100 p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-slate-800">{profile.full_name}</p><p className="mt-1 text-sm text-slate-500">{profile.email}{profile.phone ? ` · ${profile.phone}` : ""}</p></div><div className="flex items-center gap-3"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{labels[profile.role]}</span><span className={`text-xs font-bold ${profile.active ? "text-emerald-600" : "text-slate-400"}`}>{profile.active ? "Ativo" : "Inativo"}</span></div></div>)}</div></AppShell>; }
