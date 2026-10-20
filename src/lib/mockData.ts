import type { Room, Guest, Booking, InventoryStock, InventoryLog } from '../types';

export const INITIAL_ROOMS: Room[] = [
  // Planta 1: 10 Twin / Individual Doble
  { id: 'r-101', room_number: '101', floor: 1, type: 'individual_doble', status: 'disponible', price_per_night: 115, amenities: ['Wi-Fi', 'Smart TV', 'Aire Acondicionado', 'Caja Fuerte'] },
  { id: 'r-102', room_number: '102', floor: 1, type: 'individual_doble', status: 'ocupada', price_per_night: 115, amenities: ['Wi-Fi', 'Smart TV', 'Aire Acondicionado', 'Minibar'] },
  { id: 'r-103', room_number: '103', floor: 1, type: 'individual_doble', status: 'disponible', price_per_night: 120, amenities: ['Wi-Fi', 'Smart TV', 'Aire Acondicionado', 'Terraza'] },
  { id: 'r-104', room_number: '104', floor: 1, type: 'individual_doble', status: 'limpieza', price_per_night: 115, amenities: ['Wi-Fi', 'Smart TV', 'Aire Acondicionado'] },
  { id: 'r-105', room_number: '105', floor: 1, type: 'individual_doble', status: 'disponible', price_per_night: 120, amenities: ['Wi-Fi', 'Smart TV', 'Aire Acondicionado', 'Caja Fuerte'] },
  { id: 'r-106', room_number: '106', floor: 1, type: 'individual_doble', status: 'disponible', price_per_night: 115, amenities: ['Wi-Fi', 'Smart TV', 'Aire Acondicionado'] },
  { id: 'r-107', room_number: '107', floor: 1, type: 'individual_doble', status: 'ocupada', price_per_night: 125, amenities: ['Wi-Fi', 'Smart TV', 'Aire Acondicionado', 'Vistas Jardín'] },
  { id: 'r-108', room_number: '108', floor: 1, type: 'individual_doble', status: 'mantenimiento', price_per_night: 115, amenities: ['Wi-Fi', 'Smart TV', 'Aire Acondicionado'] },
  { id: 'r-109', room_number: '109', floor: 1, type: 'individual_doble', status: 'disponible', price_per_night: 120, amenities: ['Wi-Fi', 'Smart TV', 'Aire Acondicionado', 'Caja Fuerte'] },
  { id: 'r-110', room_number: '110', floor: 1, type: 'individual_doble', status: 'disponible', price_per_night: 125, amenities: ['Wi-Fi', 'Smart TV', 'Aire Acondicionado', 'Terraza'] },

  // Planta 2: 10 Matrimonio (Doble de Matrimonio)
  { id: 'r-201', room_number: '201', floor: 2, type: 'matrimonio', status: 'ocupada', price_per_night: 145, amenities: ['Cama King Size', 'Wi-Fi 6', 'Smart TV 55"', 'Nespresso', 'Bañera'] },
  { id: 'r-202', room_number: '202', floor: 2, type: 'matrimonio', status: 'disponible', price_per_night: 145, amenities: ['Cama King Size', 'Wi-Fi 6', 'Smart TV 55"', 'Nespresso'] },
  { id: 'r-203', room_number: '203', floor: 2, type: 'matrimonio', status: 'limpieza', price_per_night: 150, amenities: ['Cama King Size', 'Wi-Fi 6', 'Smart TV 55"', 'Balcón Boutique'] },
  { id: 'r-204', room_number: '204', floor: 2, type: 'matrimonio', status: 'disponible', price_per_night: 155, amenities: ['Cama King Size', 'Wi-Fi 6', 'Smart TV 55"', 'Nespresso', 'Terraza'] },
  { id: 'r-205', room_number: '205', floor: 2, type: 'matrimonio', status: 'ocupada', price_per_night: 160, amenities: ['Cama King Size', 'Wi-Fi 6', 'Smart TV 55"', 'Vistas Panorámicas'] },
  { id: 'r-206', room_number: '206', floor: 2, type: 'matrimonio', status: 'disponible', price_per_night: 145, amenities: ['Cama King Size', 'Wi-Fi 6', 'Smart TV 55"', 'Nespresso'] },
  { id: 'r-207', room_number: '207', floor: 2, type: 'matrimonio', status: 'disponible', price_per_night: 150, amenities: ['Cama King Size', 'Wi-Fi 6', 'Smart TV 55"', 'Balcón Boutique'] },
  { id: 'r-208', room_number: '208', floor: 2, type: 'matrimonio', status: 'ocupada', price_per_night: 160, amenities: ['Cama King Size', 'Wi-Fi 6', 'Smart TV 55"', 'Bañera Hidromasaje'] },
  { id: 'r-209', room_number: '209', floor: 2, type: 'matrimonio', status: 'disponible', price_per_night: 155, amenities: ['Cama King Size', 'Wi-Fi 6', 'Smart TV 55"', 'Nespresso', 'Terraza'] },
  { id: 'r-210', room_number: '210', floor: 2, type: 'matrimonio', status: 'disponible', price_per_night: 165, amenities: ['Suite Presidencial Boutique', 'Terraza Privada', 'Jacuzzi', 'Nespresso'] }
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'g-1',
    first_name: 'Elena',
    last_name: 'Navarro García',
    email: 'elena.navarro@example.com',
    phone: '+34 612 345 678',
    id_document: '47891234A',
    country: 'España',
    notes: 'Prefiere almohada viscoelástica y habitación en planta alta.',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'g-2',
    first_name: 'Carlos',
    last_name: 'Mendoza Vidal',
    email: 'carlos.mendoza@example.com',
    phone: '+34 655 987 321',
    id_document: '38912456B',
    country: 'España',
    notes: 'Cliente corporativo habitual. Solicita factura a nombre de empresa.',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'g-3',
    first_name: 'Sophie',
    last_name: 'Laurent',
    email: 'sophie.laurent@example.fr',
    phone: '+33 6 12 34 56 78',
    id_document: 'FR99887766',
    country: 'Francia',
    notes: 'Estancia de aniversario. Cava de bienvenida en la habitación.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'g-4',
    first_name: 'Lucas',
    last_name: 'Schmidt',
    email: 'lucas.schmidt@example.de',
    phone: '+49 151 2345678',
    id_document: 'DE44556677',
    country: 'Alemania',
    notes: 'Vegetariano. Alergia a plumas/polvo.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'g-5',
    first_name: 'Isabel',
    last_name: 'Romero Soria',
    email: 'isabel.romero@example.com',
    phone: '+34 670 112 233',
    id_document: '52147896K',
    country: 'España',
    notes: 'Llegada tarde tras las 21:00h.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

// Helper to get formatted date string YYYY-MM-DD
export function getOffsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-1',
    room_id: 'r-102',
    guest_id: 'g-1',
    check_in: getOffsetDateString(-2),
    check_out: getOffsetDateString(2),
    status: 'checked_in',
    total_price: 460,
    special_requests: 'Cuna de viaje adicional solicitada'
  },
  {
    id: 'b-2',
    room_id: 'r-107',
    guest_id: 'g-2',
    check_in: getOffsetDateString(-1),
    check_out: getOffsetDateString(3),
    status: 'checked_in',
    total_price: 500,
    special_requests: 'Salida tardía (Late check-out) hasta las 13:00h'
  },
  {
    id: 'b-3',
    room_id: 'r-201',
    guest_id: 'g-3',
    check_in: getOffsetDateString(0),
    check_out: getOffsetDateString(4),
    status: 'confirmed',
    total_price: 580,
    special_requests: 'Botella de Moët & Chandon a la llegada'
  },
  {
    id: 'b-4',
    room_id: 'r-205',
    guest_id: 'g-4',
    check_in: getOffsetDateString(-3),
    check_out: getOffsetDateString(0),
    status: 'checked_in',
    total_price: 480,
    special_requests: 'Ropa de cama hipoalergénica'
  },
  {
    id: 'b-5',
    room_id: 'r-208',
    guest_id: 'g-5',
    check_in: getOffsetDateString(1),
    check_out: getOffsetDateString(5),
    status: 'confirmed',
    total_price: 640,
    special_requests: 'Piso silencioso, lejos de ascensor'
  }
];

export const INITIAL_INVENTORY: InventoryStock[] = [
  { id: 'inv-1', item_name: 'Juegos Sábanas Algodón Egipcio Twin', category: 'limpieza', quantity: 45, min_stock_alert: 15, unit: 'juegos' },
  { id: 'inv-2', item_name: 'Juegos Sábanas King Matrimonio', category: 'limpieza', quantity: 38, min_stock_alert: 15, unit: 'juegos' },
  { id: 'inv-3', item_name: 'Toallas de Baño Premium 600g', category: 'limpieza', quantity: 52, min_stock_alert: 20, unit: 'uds' },
  { id: 'inv-4', item_name: 'Champú & Gel Botánico 50ml', category: 'amenities', quantity: 12, min_stock_alert: 25, unit: 'uds' }, // ALERTA
  { id: 'inv-5', item_name: 'Set Dental Ecológico Bambú', category: 'amenities', quantity: 7, min_stock_alert: 20, unit: 'uds' }, // ALERTA
  { id: 'inv-6', item_name: 'Zapatillas de Algodón Suave', category: 'amenities', quantity: 32, min_stock_alert: 15, unit: 'pares' },
  { id: 'inv-7', item_name: 'Agua Mineral Solán de Cabras 330ml', category: 'minibar', quantity: 64, min_stock_alert: 24, unit: 'botellas' },
  { id: 'inv-8', item_name: 'Cápsulas Café Nespresso Ristretto', category: 'minibar', quantity: 120, min_stock_alert: 40, unit: 'cápsulas' },
  { id: 'inv-9', item_name: 'Vino Tinto Reserva D.O. 375ml', category: 'minibar', quantity: 5, min_stock_alert: 12, unit: 'botellas' }, // ALERTA
  { id: 'inv-10', item_name: 'Bombillas LED Cálidas E27 7W', category: 'mantenimiento', quantity: 18, min_stock_alert: 5, unit: 'uds' },
  { id: 'inv-11', item_name: 'Pilas AAA para Mandos a Distancia', category: 'mantenimiento', quantity: 4, min_stock_alert: 10, unit: 'packs' } // ALERTA
];

export const INITIAL_INVENTORY_LOGS: InventoryLog[] = [
  { id: 'log-1', item_id: 'inv-4', change_amount: 10, type: 'out', reason: 'Reposición habitaciones plantas 1 y 2', created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: 'log-2', item_id: 'inv-9', change_amount: 3, type: 'out', reason: 'Consumo minibar habitaciones 201 y 205', created_at: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: 'log-3', item_id: 'inv-8', change_amount: 50, type: 'in', reason: 'Recepción pedido proveedor Nespresso', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'log-4', item_id: 'inv-5', change_amount: 15, type: 'out', reason: 'Entrega en amenities de suites', created_at: new Date(Date.now() - 86400000 * 2).toISOString() }
];
