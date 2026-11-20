"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, UserRound } from "lucide-react";
import type { Delivery } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function DeliveryCard({ delivery, showCourier = true }: { delivery: Delivery; showCourier?: boolean }) {
  const courier = delivery.courier;
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-wide text-slate-400">{delivery.tracking_code}</p><h3 className="mt-1 font-bold text-slate-900">{delivery.customer_name}</h3></div><StatusBadge status={delivery.status} /></div><div className="mt-4 space-y-2 text-sm text-slate-600"><p className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />{delivery.customer_address}</p>{delivery.customer_phone && <p className="flex gap-2"><Phone size={16} className="shrink-0 text-slate-400" />{delivery.customer_phone}</p>}{showCourier && courier && <p className="flex gap-2"><UserRound size={16} className="shrink-0 text-slate-400" />{courier.full_name}</p>}</div><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-xs font-medium text-slate-500">{delivery.document_type} · {delivery.document_number ?? "Sem número"}</span><Link href={`/entregas/${delivery.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700">Ver detalhes <ArrowUpRight size={15} /></Link></div></article>;
}
