import L from 'leaflet'

export const markerSvg = `
<svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 0C8.059 0 0 8.059 0 18C0 31.5 18 46 18 46C18 46 36 31.5 36 18C36 8.059 27.941 0 18 0Z" fill="#0c8a60"/>
  <g transform="translate(9, 7) scale(0.75)" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
    <line x1="6" y1="2" x2="6" y2="4"></line>
    <line x1="10" y1="2" x2="10" y2="4"></line>
    <line x1="14" y1="2" x2="14" y2="4"></line>
  </g>
</svg>
`

export const aestheticMarkerIcon = new L.divIcon({
  className: 'custom-aesthetic-marker',
  html: `<div class="marker-svg-wrap">${markerSvg}</div><div class="marker-shadow-pulse"></div>`,
  iconSize: [36, 46],
  iconAnchor: [18, 46]
})

export const initialUsers = [
  { id: 1, name: 'Admin NHS', email: 'admin@nhs.com', phone: '081234567890', role: 'admin', verified: true, password: 'admin123' },
  { id: 2, name: 'Marsel', email: 'marsel@student.ub.ac.id', phone: '081298765432', role: 'student', verified: true, password: 'marsel123' },
  {
    id: 3,
    name: 'Merchant Mie Gacoan',
    email: 'gacoan@merchant.com',
    phone: '081211112222',
    role: 'merchant',
    verified: true,
    password: 'merchant123',
  },
]

export const initialSpots = [
  {
    id: 1,
    name: 'Teras Tlogomas',
    area: 'Lowokwaru',
    budget: 12000,
    wifiMbps: 45,
    sockets: 14,
    vibe: 'WFC Friendly',
    status: 'approved',
    lat: -7.9445,
    lng: 112.6058,
    image:
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80',
    ownerId: 3,
    menu: 'Es Teh, Kopi Susu, Roti Bakar',
    facilities: 'WiFi Cepat, Smoking Area, Toilet',
    operationalHours: '10:00 - 23:00',
    reviews: [{ id: 1, userId: 2, userName: 'Marsel', rating: 5, comment: 'WiFi stabil banget buat nugas.' }],
  },
  {
    id: 2,
    name: 'Sore Brawijaya Corner',
    area: 'Sumbersari',
    budget: 18000,
    wifiMbps: 25,
    sockets: 8,
    vibe: 'Coffee & Study',
    status: 'approved',
    lat: -7.9537,
    lng: 112.6148,
    image:
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=80',
    ownerId: 3,
    menu: 'Americano, Croffle, Kentang',
    facilities: 'Indoor AC, WiFi, Parkir Motor',
    operationalHours: '09:00 - 22:00',
    reviews: [],
  },
  {
    id: 3,
    name: 'Kebun Kota Spot',
    area: 'Klojen',
    budget: 10000,
    wifiMbps: 30,
    sockets: 10,
    vibe: 'Outdoor Chill',
    status: 'approved',
    lat: -7.9813,
    lng: 112.6304,
    image:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80',
    ownerId: 3,
    menu: 'Mie, Nasi Goreng, Teh Tarik',
    facilities: 'Taman, Colokan Outdoor, Mushola',
    operationalHours: '08:00 - 21:00',
    reviews: [],
  },
  {
    id: 4,
    name: 'Suhu Malam Space',
    area: 'Dinoyo',
    budget: 14000,
    wifiMbps: 60,
    sockets: 20,
    vibe: 'Night Productive',
    status: 'approved',
    lat: -7.9368,
    lng: 112.6072,
    image:
      'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=900&q=80',
    ownerId: 3,
    menu: 'Kopi Gula Aren, Chicken Pop, Nasi Ayam',
    facilities: '24 jam, WiFi, Ruang Diskusi',
    operationalHours: '16:00 - 02:00',
    reviews: [],
  },
]
