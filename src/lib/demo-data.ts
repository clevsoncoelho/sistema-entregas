import type { Delivery, Product, Profile } from "./types";

export const demoProfiles: Profile[] = [
  { id: "p-admin", full_name: "Mariana Costa", email: "mariana@empresa.com", role: "admin", phone: "(11) 99999-0000", active: true },
  { id: "p-vendedor", full_name: "Rafael Lima", email: "rafael@empresa.com", role: "vendedor", phone: "(11) 98888-1111", active: true },
  { id: "p-motoboy", full_name: "Diego Santos", email: "diego@empresa.com", role: "motoboy", phone: "(11) 97777-2222", active: true },
  { id: "p-motoboy-2", full_name: "Lucas Oliveira", email: "lucas@empresa.com", role: "motoboy", phone: "(11) 96666-3333", active: true },
];

export const demoProducts: Product[] = [
  { id: "prod-1", sku: "ROL-001", name: "Rolamento 6204", description: "Rolamento blindado", unit: "un", active: true },
  { id: "prod-2", sku: "COR-010", name: "Correia industrial A-42", description: "Correia de transmissão", unit: "un", active: true },
  { id: "prod-3", sku: "KIT-030", name: "Kit de vedação", description: "Kit para manutenção", unit: "kit", active: true },
];

export const demoDeliveries: Delivery[] = [
  { id: "del-1", tracking_code: "ENT-2026-0018", customer_name: "Metalúrgica Horizonte", customer_address: "Av. das Nações, 840 - Mooca, São Paulo/SP", customer_phone: "(11) 3222-1010", document_type: "NF", document_number: "NF 45821", document_file_path: null, status: "em_rota", delivery_notes: "Entregar na doca 2. Conferir lacre antes de sair.", issue_notes: null, seller_id: "p-vendedor", courier_id: "p-motoboy", created_at: "2026-11-19T14:20:00Z", delivered_at: null },
  { id: "del-2", tracking_code: "ENT-2026-0017", customer_name: "Construtora Vale Azul", customer_address: "Rua Harmonia, 215 - Vila Madalena, São Paulo/SP", customer_phone: "(11) 3111-2020", document_type: "OS", document_number: "OS 9820", document_file_path: null, status: "aguardando_coleta", delivery_notes: "Cliente pediu contato 15 minutos antes.", issue_notes: null, seller_id: "p-vendedor", courier_id: "p-motoboy", created_at: "2026-11-19T12:05:00Z", delivered_at: null },
  { id: "del-3", tracking_code: "ENT-2026-0016", customer_name: "Oficina Rota 7", customer_address: "Rua dos Pinheiros, 1220 - Pinheiros, São Paulo/SP", customer_phone: "(11) 3000-3030", document_type: "NF", document_number: "NF 45817", document_file_path: null, status: "entregue", delivery_notes: "Receber assinatura no canhoto.", issue_notes: null, seller_id: "p-vendedor", courier_id: "p-motoboy-2", created_at: "2026-11-18T16:30:00Z", delivered_at: "2026-11-19T10:15:00Z" },
  { id: "del-4", tracking_code: "ENT-2026-0015", customer_name: "Comercial São Bento", customer_address: "Rua do Gasômetro, 500 - Brás, São Paulo/SP", customer_phone: "(11) 2888-4040", document_type: "OUTRO", document_number: "Pedido 7401", document_file_path: null, status: "ocorrencia", delivery_notes: "Volume frágil.", issue_notes: "Cliente ausente no endereço.", seller_id: "p-vendedor", courier_id: "p-motoboy-2", created_at: "2026-11-18T09:10:00Z", delivered_at: null },
];

export function profileById(id: string | null | undefined) { return demoProfiles.find((profile) => profile.id === id); }
export function statusLabel(status: Delivery["status"]) { return ({ aguardando_coleta: "Aguardando coleta", em_rota: "Em rota", entregue: "Entregue", ocorrencia: "Ocorrência" })[status]; }
export function statusTone(status: Delivery["status"]) { return ({ aguardando_coleta: "amber", em_rota: "blue", entregue: "green", ocorrencia: "red" })[status]; }
