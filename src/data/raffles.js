export const raffles = [
  {
    id: '1',
    title: 'Gran Rifa de iPhone 15 Pro Max',
    description: '¡Participa y gana el nuevo iPhone 15 Pro Max! Solo 100 boletos disponibles. El sorteo se realizará en vivo por Instagram.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
    createdAt: '2023-10-01T10:00:00Z',
    endDate: '2023-12-25T20:00:00Z',
    price: 50,
    occupiedTickets: [1, 5, 10, 15, 20, 25, 50, 75, 99, 100, 12, 34, 56, 78]
  },
  {
    id: '2',
    title: 'Sorteo de MacBook Air M2',
    description: 'Llévate la laptop más ligera y potente de Apple. Ideal para estudiantes y profesionales.',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    createdAt: '2023-11-01T09:00:00Z',
    endDate: '2024-01-15T18:00:00Z',
    price: 100,
    occupiedTickets: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
  },
  {
    id: '3',
    title: 'Cena Romántica para 2',
    description: 'Disfruta de una experiencia gastronómica inolvidable en el mejor restaurante de la ciudad.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
    createdAt: '2023-11-10T12:00:00Z',
    endDate: '2023-11-30T21:00:00Z',
    price: 20,
    occupiedTickets: Array.from({ length: 80 }, (_, i) => i + 1) // Almost full
  }
];
