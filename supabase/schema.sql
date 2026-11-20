create type user_role as enum ('vendedor', 'motoboy', 'admin');
create type delivery_document_type as enum ('NF', 'OS', 'OUTRO');
create type delivery_status as enum ('aguardando_coleta', 'em_rota', 'entregue', 'ocorrencia', 'cancelada');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role user_role not null default 'vendedor',
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text,
  name text not null,
  description text,
  unit text not null default 'un',
  active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (sku)
);

create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique,
  customer_name text not null,
  customer_address text not null,
  customer_phone text,
  document_type delivery_document_type not null default 'NF',
  document_number text,
  document_file_url text,
  document_file_path text,
  status delivery_status not null default 'aguardando_coleta',
  delivery_notes text,
  issue_notes text,
  seller_id uuid not null references public.profiles(id),
  courier_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  delivered_at timestamptz
);

create table if not exists public.delivery_items (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references public.deliveries(id) on delete cascade,
  product_id uuid references public.products(id),
  custom_item_name text,
  quantity numeric(12,3) not null default 1,
  notes text,
  check ((product_id is not null) or (custom_item_name is not null))
);

create table if not exists public.delivery_status_logs (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references public.deliveries(id) on delete cascade,
  changed_by uuid not null references public.profiles(id),
  old_status delivery_status,
  new_status delivery_status not null,
  note text,
  created_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.log_delivery_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.status is distinct from new.status then
    insert into public.delivery_status_logs (delivery_id, changed_by, old_status, new_status, note)
    values (new.id, auth.uid(), old.status, new.status, new.issue_notes);
  end if;
  new.updated_at = now();
  if new.status = 'entregue' then new.delivered_at = now(); end if;
  return new;
end;
$$;

drop trigger if exists delivery_status_change on public.deliveries;
create trigger delivery_status_change before update on public.deliveries
for each row execute procedure public.log_delivery_status();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.deliveries enable row level security;
alter table public.delivery_items enable row level security;
alter table public.delivery_status_logs enable row level security;

create policy "profiles_read" on public.profiles for select to authenticated
using (id = auth.uid() or current_user_role() = 'admin');
create policy "profiles_admin_update" on public.profiles for update to authenticated
using (current_user_role() = 'admin');

create policy "products_read" on public.products for select to authenticated using (active or current_user_role() = 'admin');
create policy "products_write" on public.products for insert to authenticated
with check (current_user_role() in ('vendedor','admin'));
create policy "products_update" on public.products for update to authenticated
using (current_user_role() = 'admin' or (current_user_role() = 'vendedor' and created_by = auth.uid()));

create policy "deliveries_admin_read" on public.deliveries for select to authenticated
using (current_user_role() = 'admin');
create policy "deliveries_seller_read" on public.deliveries for select to authenticated
using (seller_id = auth.uid());
create policy "deliveries_courier_read" on public.deliveries for select to authenticated
using (courier_id = auth.uid());
create policy "deliveries_seller_insert" on public.deliveries for insert to authenticated
with check (current_user_role() in ('vendedor','admin') and seller_id = auth.uid());
create policy "deliveries_seller_update" on public.deliveries for update to authenticated
using (current_user_role() = 'admin' or seller_id = auth.uid());
create policy "deliveries_courier_update" on public.deliveries for update to authenticated
using (courier_id = auth.uid());

create policy "items_admin" on public.delivery_items for all to authenticated
using (exists (select 1 from public.deliveries d where d.id = delivery_id and current_user_role() = 'admin'));
create policy "items_seller" on public.delivery_items for all to authenticated
using (exists (select 1 from public.deliveries d where d.id = delivery_id and d.seller_id = auth.uid()));
create policy "items_courier" on public.delivery_items for select to authenticated
using (exists (select 1 from public.deliveries d where d.id = delivery_id and d.courier_id = auth.uid()));

create policy "logs_read" on public.delivery_status_logs for select to authenticated
using (current_user_role() = 'admin' or exists (
  select 1 from public.deliveries d
  where d.id = delivery_id and (d.seller_id = auth.uid() or d.courier_id = auth.uid())
));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documentos-entregas', 'documentos-entregas', false, 10485760,
  array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "documentos_auth_read" on storage.objects for select to authenticated
using (bucket_id = 'documentos-entregas');
create policy "documentos_auth_upload" on storage.objects for insert to authenticated
with check (bucket_id = 'documentos-entregas');
