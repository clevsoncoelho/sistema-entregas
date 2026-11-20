import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { Profile, UserRole } from "@/lib/types";

export async function getCurrentProfile(): Promise<Profile> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile, error } = await supabase.from("profiles").select("id,full_name,email,role,phone,active").eq("id", user.id).single();
  if (error || !profile || !profile.active) redirect("/login");
  return profile as Profile;
}

export function roleHome(role: UserRole) { return role === "admin" ? "/admin" : role === "motoboy" ? "/motoboy" : "/vendedor"; }

export async function requireRole(allowed: UserRole | UserRole[]) {
  const profile = await getCurrentProfile();
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  if (!roles.includes(profile.role)) redirect(roleHome(profile.role));
  return profile;
}
