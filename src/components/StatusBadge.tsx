import type { DeliveryStatus } from "@/lib/types";
import { statusLabel, statusTone } from "@/lib/status";

export default function StatusBadge({ status }: { status: DeliveryStatus }) {
  const tone = statusTone(status);
  const styles = { amber: "bg-amber-50 text-amber-700 ring-amber-200", blue: "bg-blue-50 text-blue-700 ring-blue-200", green: "bg-emerald-50 text-emerald-700 ring-emerald-200", red: "bg-red-50 text-red-700 ring-red-200", slate: "bg-slate-100 text-slate-600 ring-slate-200" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[tone as keyof typeof styles]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{statusLabel(status)}</span>;
}
