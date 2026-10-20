-- ==========================================================
-- HOTEL RISS - BOUTIQUE HOTEL MANAGEMENT SYSTEM
-- Schema Database for Supabase (PostgreSQL)
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ROOMS TABLE (20 Habitaciones)
create table if not exists public.rooms (
    id uuid primary key default gen_random_uuid(),
    room_number varchar(10) not null unique,
    floor integer not null default 1,
    type varchar(30) not null check (type in ('individual_doble', 'matrimonio')),
    status varchar(30) not null default 'disponible' check (status in ('disponible', 'ocupada', 'limpieza', 'mantenimiento')),
    price_per_night numeric(10, 2) not null check (price_per_night >= 0),
    amenities text[] default array['Wi-Fi', 'Smart TV', 'Aire Acondicionado', 'Caja Fuerte', 'Cafetera Nespresso'],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_rooms_status on public.rooms (status);
create index if not exists idx_rooms_type on public.rooms (type);

-- 2. GUESTS TABLE (CRM de Huéspedes)
create table if not exists public.guests (
    id uuid primary key default gen_random_uuid(),
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    email varchar(255) not null,
    phone varchar(50),
    id_document varchar(50) not null,
    country varchar(100) default 'España',
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_guests_email on public.guests (email);
create index if not exists idx_guests_id_document on public.guests (id_document);
create index if not exists idx_guests_names on public.guests (last_name, first_name);

-- 3. BOOKINGS TABLE (Reservas / Planning)
create table if not exists public.bookings (
    id uuid primary key default gen_random_uuid(),
    room_id uuid not null references public.rooms (id) on delete restrict,
    guest_id uuid not null references public.guests (id) on delete restrict,
    check_in date not null,
    check_out date not null,
    status varchar(30) not null default 'confirmed' check (status in ('confirmed', 'checked_in', 'checked_out', 'cancelled')),
    total_price numeric(10, 2) not null check (total_price >= 0),
    special_requests text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint check_dates check (check_out > check_in)
);

create index if not exists idx_bookings_room on public.bookings (room_id);
create index if not exists idx_bookings_guest on public.bookings (guest_id);
create index if not exists idx_bookings_dates on public.bookings (check_in, check_out);
create index if not exists idx_bookings_status on public.bookings (status);

-- 4. INVENTORY STOCK TABLE
create table if not exists public.inventory_stock (
    id uuid primary key default gen_random_uuid(),
    item_name varchar(150) not null,
    category varchar(30) not null check (category in ('limpieza', 'minibar', 'amenities', 'mantenimiento')),
    quantity numeric(10, 2) not null default 0 check (quantity >= 0),
    min_stock_alert numeric(10, 2) not null default 5 check (min_stock_alert >= 0),
    unit varchar(20) not null default 'uds',
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_inventory_category on public.inventory_stock (category);

-- 5. INVENTORY LOG TABLE (Trazabilidad de entradas/salidas)
create table if not exists public.inventory_log (
    id uuid primary key default gen_random_uuid(),
    item_id uuid not null references public.inventory_stock (id) on delete cascade,
    change_amount numeric(10, 2) not null check (change_amount > 0),
    type varchar(10) not null check (type in ('in', 'out')),
    reason text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_inventory_log_item on public.inventory_log (item_id);
create index if not exists idx_inventory_log_created_at on public.inventory_log (created_at desc);

-- Function and trigger to auto-update stock when an inventory log is created
create or replace function public.update_stock_on_log()
returns trigger as $$
begin
    if (new.type = 'in') then
        update public.inventory_stock
        set quantity = quantity + new.change_amount,
            updated_at = now()
        where id = new.item_id;
    elsif (new.type = 'out') then
        update public.inventory_stock
        set quantity = greatest(0, quantity - new.change_amount),
            updated_at = now()
        where id = new.item_id;
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_inventory_log_applied on public.inventory_log;
create trigger trg_inventory_log_applied
    after insert on public.inventory_log
    for each row
    execute function public.update_stock_on_log();

-- Enable Row Level Security (RLS)
alter table public.rooms enable row level security;
alter table public.guests enable row level security;
alter table public.bookings enable row level security;
alter table public.inventory_stock enable row level security;
alter table public.inventory_log enable row level security;

-- Policies for public / authenticated staff access in Hotel Riss PMS
create policy "Allow all access to rooms" on public.rooms for all using (true) with check (true);
create policy "Allow all access to guests" on public.guests for all using (true) with check (true);
create policy "Allow all access to bookings" on public.bookings for all using (true) with check (true);
create policy "Allow all access to inventory_stock" on public.inventory_stock for all using (true) with check (true);
create policy "Allow all access to inventory_log" on public.inventory_log for all using (true) with check (true);

-- ==========================================================
-- SEED DATA: 20 HABITACIONES BOUTIQUE
-- 10 Twin (Individual Doble) + 10 Doble Matrimonio
-- ==========================================================

insert into public.rooms (room_number, floor, type, status, price_per_night) values
-- Planta 1: 10 Twin / Individual Doble
('101', 1, 'individual_doble', 'disponible', 115.00),
('102', 1, 'individual_doble', 'ocupada', 115.00),
('103', 1, 'individual_doble', 'disponible', 120.00),
('104', 1, 'individual_doble', 'limpieza', 115.00),
('105', 1, 'individual_doble', 'disponible', 120.00),
('106', 1, 'individual_doble', 'disponible', 115.00),
('107', 1, 'individual_doble', 'ocupada', 125.00),
('108', 1, 'individual_doble', 'mantenimiento', 115.00),
('109', 1, 'individual_doble', 'disponible', 120.00),
('110', 1, 'individual_doble', 'disponible', 125.00),

-- Planta 2: 10 Matrimonio (Doble de Matrimonio)
('201', 2, 'matrimonio', 'ocupada', 145.00),
('202', 2, 'matrimonio', 'disponible', 145.00),
('203', 2, 'matrimonio', 'limpieza', 150.00),
('204', 2, 'matrimonio', 'disponible', 155.00),
('205', 2, 'matrimonio', 'ocupada', 160.00),
('206', 2, 'matrimonio', 'disponible', 145.00),
('207', 2, 'matrimonio', 'disponible', 150.00),
('208', 2, 'matrimonio', 'ocupada', 160.00),
('209', 2, 'matrimonio', 'disponible', 155.00),
('210', 2, 'matrimonio', 'disponible', 165.00)
on conflict (room_number) do nothing;

-- ==========================================================
-- SEED DATA: INVENTARIO INICIAL
-- ==========================================================
insert into public.inventory_stock (item_name, category, quantity, min_stock_alert, unit) values
('Juego Sábanas Algodón Egipcio Twin', 'limpieza', 45, 15, 'juegos'),
('Juego Sábanas King Matrimonio', 'limpieza', 38, 15, 'juegos'),
('Toallas de Baño Premium 600g', 'limpieza', 52, 20, 'uds'),
('Champú & Gel Botánico 50ml', 'amenities', 14, 25, 'uds'), -- Alerta de stock bajo
('Set Dental Ecológico Bambú', 'amenities', 8, 20, 'uds'), -- Alerta de stock bajo
('Zapatillas de Algodón Suave', 'amenities', 32, 15, 'pares'),
('Agua Mineral Premium Solán 330ml', 'minibar', 64, 24, 'botellas'),
('Cápsulas Café Nespresso Ristretto', 'minibar', 120, 40, 'cápsulas'),
('Vino Tinto Reserva D.O. 375ml', 'minibar', 6, 12, 'botellas'), -- Alerta de stock bajo
('Bombillas LED Cálidas E27', 'mantenimiento', 18, 5, 'uds'),
('Pilas AAA para Mandos TV', 'mantenimiento', 3, 10, 'packs') -- Alerta de stock bajo
on conflict do nothing;

-- ==========================================================
-- SEED DATA: HUÉSPEDES DE EJEMPLO
-- ==========================================================
insert into public.guests (first_name, last_name, email, phone, id_document, country, notes) values
('Elena', 'Navarro García', 'elena.navarro@example.com', '+34 612 345 678', '47891234A', 'España', 'Prefiere almohada viscoelástica y piso alto.'),
('Carlos', 'Mendoza Vidal', 'carlos.mendoza@example.com', '+34 655 987 321', '38912456B', 'España', 'Cliente frecuente de negocios. Check-in tardío.'),
('Sophie', 'Laurent', 'sophie.laurent@example.fr', '+33 6 12 34 56 78', 'FR99887766', 'Francia', 'Reserva de escapada romántica. Solicitó cava de bienvenida.'),
('Lucas', 'Schmidt', 'lucas.schmidt@example.de', '+49 151 2345678', 'DE44556677', 'Alemania', 'Alergia al marisco y al polvo.')
on conflict do nothing;
