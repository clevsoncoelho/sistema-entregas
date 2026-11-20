import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import type { UserRole } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const { data: requester } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (requester?.role !== "admin") return NextResponse.json({ error: "Somente o administrativo pode cadastrar usuários." }, { status: 403 });
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY não configurada no servidor." }, { status: 503 });
  const body = await request.json() as { full_name?: string; email?: string; password?: string; role?: UserRole; phone?: string };
  if (!body.full_name?.trim() || !body.email?.trim() || !body.password || !["admin", "vendedor", "motoboy"].includes(body.role ?? "")) return NextResponse.json({ error: "Preencha nome, e-mail, senha e perfil." }, { status: 400 });
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.auth.admin.createUser({ email: body.email.trim(), password: body.password, email_confirm: true, user_metadata: { full_name: body.full_name.trim() } });
  if (error || !data.user) return NextResponse.json({ error: error?.message ?? "Não foi possível criar o usuário." }, { status: 400 });
  const { error: profileError } = await admin.from("profiles").update({ full_name: body.full_name.trim(), phone: body.phone?.trim() || null, role: body.role, active: true }).eq("id", data.user.id);
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });
  return NextResponse.json({ id: data.user.id, email: data.user.email, role: body.role });
}
