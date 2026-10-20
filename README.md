# Hotel Riss — Boutique Hotel Management System (PMS)

Sistema integral de gestión para hotel boutique de **20 habitaciones exclusivas**, desarrollado con **React**, **TypeScript**, **Tailwind CSS**, **Vite** y **Supabase** (PostgreSQL).

---

## 🏨 Estructura de Habitaciones (20 en total)

* **Planta 1 (Habitaciones 101 a 110):** 10 Habitaciones con camas individuales dobles (*Twin / Doble*).
* **Planta 2 (Habitaciones 201 a 210):** 10 Habitaciones de matrimonio (*Doble de Matrimonio*).
* **Estados en tiempo real:** `Disponible`, `Ocupada`, `Limpieza` y `Mantenimiento`.

---

## 📱 Módulos de la Aplicación

1. **Dashboard Operativo:**
   - Métricas rápidas: Ocupación actual (%), habitaciones libres, llegadas y salidas de hoy, alertas de stock bajo.
   - Vista general de las 20 habitaciones con accesos directos.
   - Acciones 1-click para Check-In y reposición urgente de inventario.

2. **Planning de Reservas Interactivo:**
   - Calendario matricial con las 20 habitaciones en el eje vertical y los días en el horizontal (vistas de 7, 14 y 21 días).
   - Bloques de reservas coloreados según estado (`Confirmada`, `Checked-In`, `Checked-Out`, `Cancelada`).
   - Clic en fecha/habitación para creación rápida de reservas.

3. **CRM de Huéspedes:**
   - Fichero completo de clientes con buscador reactivo por nombre, DNI/pasaporte, email o teléfono.
   - Registro y edición de clientes con ficha de notas y preferencias.
   - Historial de estancias asociadas.

4. **Control de Stock e Inventario:**
   - Seguimiento en tiempo real por categorías: *Lencería y Limpieza*, *Minibar y Bebidas*, *Amenities y Baño* y *Mantenimiento*.
   - Alerta visual inmediata cuando el stock es inferior a `min_stock_alert`.
   - Registro de entradas (reposición) y salidas (consumo) con motivo que alimenta `inventory_log`.

5. **Gestión de Habitaciones (Gobernanza):**
   - Control de estado de limpieza y mantenimiento.
   - Editor directo de tarifa por noche y visualización de equipamiento/amenities.

---

## 🗄️ Base de Datos en Supabase

El esquema SQL completo con tablas, índices, triggers y datos de prueba iniciales se encuentra en:
📁 `supabase/schema.sql`

Tablas incluidas:
* `rooms`
* `guests`
* `bookings`
* `inventory_stock`
* `inventory_log`

Para aplicarlo:
1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard).
2. Ve a **SQL Editor**.
3. Pega el contenido de `supabase/schema.sql` y pulsa **Run**.

---

## 🚀 Instalación y Puesta en Marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (opcional)
cp .env.example .env
# Completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación se abrirá en `http://localhost:5173/`.
