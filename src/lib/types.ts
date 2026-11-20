export type UserRole = "vendedor" | "motoboy" | "admin";
export type DeliveryStatus =
  | "aguardando_coleta"
  | "em_rota"
  | "entregue"
  | "ocorrencia";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  active: boolean;
}

export interface Product {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  unit: string;
  active: boolean;
}

export interface Delivery {
  id: string;
  tracking_code: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string | null;
  document_type: "NF" | "OS" | "OUTRO";
  document_number: string | null;
  document_file_path: string | null;
  status: DeliveryStatus;
  delivery_notes: string | null;
  issue_notes: string | null;
  seller_id: string;
  courier_id: string | null;
  created_at: string;
  delivered_at: string | null;
  seller?: Profile;
  courier?: Profile;
  delivery_items?: DeliveryItem[];
}

export interface DeliveryItem {
  id: string;
  delivery_id: string;
  product_id: string | null;
  custom_item_name: string | null;
  quantity: number;
  notes: string | null;
  product?: Product;
}
