"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { DeliveryStatus, UserRole } from "@/lib/types";

export default function DeliveryActions({ deliveryId, status, role }: { deliveryId: string; status: DeliveryStatus; role: UserRole }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function change(nextStatus: DeliveryStatus) {
    const needsNote = nextStatus === "ocorrencia" || nextStatus === "cancelada";
    const note = needsNote ? window.prompt(nextStatus === "cancelada" ? "Informe o motivo do cancelamento:" : "Informe a ocorrência:") : null;
    if (needsNote && !note?.trim()) return;
    setSaving(true); setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase.from("deliveries").update({ status: nextStatus, issue_notes: note?.trim() ?? null }).eq("id", deliveryId);
    if (updateError) setError(updateError.message); else window.location.reload();
    setSaving(false);
  }
  if (status === "entregue" || status === "cancelada") return null;
  return <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold text-slate-900">Ações</h3><div className="mt-4 flex flex-wrap gap-3">{role === "motoboy" && status === "aguardando_coleta" && <button disabled={saving} onClick={() => change("em_rota")} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Iniciar rota</button>}{role === "motoboy" && status === "em_rota" && <button disabled={saving} onClick={() => change("entregue")} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Marcar como entregue</button>}{(role === "admin" || role === "vendedor") && <button disabled={saving} onClick={() => change("cancelada")} className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 disabled:opacity-50">Cancelar entrega</button>}{role === "motoboy" && <button disabled={saving} onClick={() => change("ocorrencia")} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 disabled:opacity-50">Registrar ocorrência</button>}</div>{error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}</section>;
}
