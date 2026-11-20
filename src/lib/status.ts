import type { DeliveryStatus } from "./types";
export function statusLabel(status: DeliveryStatus) { return ({ aguardando_coleta: "Aguardando coleta", em_rota: "Em rota", entregue: "Entregue", ocorrencia: "Ocorrência", cancelada: "Cancelada" })[status]; }
export function statusTone(status: DeliveryStatus) { return ({ aguardando_coleta: "amber", em_rota: "blue", entregue: "green", ocorrencia: "red", cancelada: "slate" })[status]; }
