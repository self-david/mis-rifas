export const raffles = [
  {
    id: 'dia-de-las-madres-gap',
    title: 'Sorteo Día de las Madres para GAP\'S Graduados',
    description: '¡Celebremos juntos el amor incondicional! 🌸 Esta rifa es un tributo especial para todas las madres. Participa por un detalle exclusivo hecho a medida y grabado en madera, totalmente personalizado para agradecer a esa persona que lo da todo.',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800', // Beautiful flowers for Mother's Day
    createdAt: '2024-04-01T10:00:00Z',
    endDate: '2024-04-23T23:59:59Z', // Thursday 23rd April (Year assumed 2024 or generic)
    drawDate: '2024-04-24T20:00:00Z', // Friday 24th April
    price: 0,
    totalTickets: 1000,
    startNumber: 0,
    digits: 3,
    winningNumber: null, // To be filled manually
    occupiedTickets: [], // Managed externally
    externalRegistrationLink: 'https://docs.google.com/spreadsheets/d/11Z3wzZfIVDri_Ui9Bd7slmy9Xvymn3jf5JvNB4YI4KI/edit?usp=sharing',
    rules: {
      source: 'Lotería Nacional - Sorteo Superior (24 de Abril)',
      description: 'El último día para adquirir un boleto es el jueves 23 de abril. El ganador se determinará con las últimas 3 cifras del Premio Mayor del Sorteo Superior del viernes 24 de abril.',
      fallback: 'Si no hay ganador exacto, el premio se asignará al número con menor diferencia absoluta. En caso de empate (equidistancia), ambos ganan.',
    },
    seo: {
      title: 'Sorteo Día de las Madres 🌸',
      description: 'Participa y gana un detalle exclusivo grabado en madera. ¡Sorteo el 24 de Abril!',
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=1200',
    }
  }
];
