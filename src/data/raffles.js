export const raffles = [
  {
    id: 'dia-de-las-madres-gap',
    title: 'Sorteo Día de las Madres para GAP\'S Graduados',
    description: '¡Celebremos juntos el amor incondicional! 🌸 Esta rifa es un tributo especial para todas las madres. Participa por un detalle exclusivo hecho a medida y grabado en madera, totalmente personalizado para agradecer a esa persona que lo da todo.',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
    createdAt: '2024-04-01T10:00:00Z',
    endDate: '2024-04-30T23:59:59Z',
    drawDate: '2024-05-01T20:00:00Z',
    price: 0,
    totalTickets: 1000,
    startNumber: 0,
    digits: 3,
    winningNumber: null,
    occupiedTickets: [],
    externalRegistrationLink: 'https://docs.google.com/spreadsheets/d/11Z3wzZfIVDri_Ui9Bd7slmy9Xvymn3jf5JvNB4YI4KI/edit?usp=sharing',
    rules: {
      source: 'Lotería Nacional - Sorteo Superior (24 de Abril)',
      description: 'El último día para adquirir un boleto es el jueves 30 de abril. El ganador se determinará con las últimas 3 cifras del Premio Mayor del Sorteo Superior del viernes 1 de mayo.',
      fallback: 'Si no hay ganador exacto, el premio se asignará al número con menor diferencia absoluta. En caso de empate (equidistancia), ambos ganan y se daran 2 premios a cada uno.',
    },
    seo: {
      title: 'Sorteo Día de las Madres 🌸',
      description: 'Participa y gana un detalle exclusivo grabado en madera. ¡Sorteo el 24 de Abril!',
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=1200',
    },
    prizes: [
      {
        id: 'caja-sorpresa',
        name: 'caja sorpresa',
        description: 'Caja explosiva del Día de la Madre',
        image: '/dia de las madres/caja.jpg'
      },
      {
        id: 'corazon',
        name: 'corazon',
        description: 'corazon con porta retrato',
        image: '/dia de las madres/corazon.jpg'
      },
      {
        id: 'flor',
        name: 'flor',
        description: 'flor con mensaje personalizado',
        image: '/dia de las madres/flor.jpg'
      },
      {
        id: 'portaretratos',
        name: 'portaretratos',
        description: 'portaretratos',
        image: '/dia de las madres/retrato.jpg'
      },
      {
        id: 'caja-sombra',
        name: 'caja sombra',
        description: 'Caja de sombras 3D para el Día de la Madre con flores y mariposas, arte en papel en capas',
        image: '/dia de las madres/caja-sombra.webp'
      },
      {
        id: 'marcos',
        name: 'marcos',
        description: 'marco de dia de las madres con mensaje personalizado',
        image: '/dia de las madres/marcos.jpg'
      },
      {
        id: 'caja-de-regalo',
        name: 'caja de regalo',
        description: 'caja de regalo con mensaje personalizado',
        image: '/dia de las madres/caja-de-regalo.jpg'
      },
      {
        id: 'tulipanes',
        name: 'tulipanes',
        description: 'Tulipanes para el día de la madre',
        image: '/dia de las madres/tulipanes.jpg'
      }
    ]
  },
  {
    id: 'super-peri-cuadro',
    title: 'Sorteo Super Peri - Cuadro',
    description: '¡Participa en el sorteo de este exclusivo cuadro "Peri"! Una pieza única que aportará elegancia y color a cualquier espacio.',
    image: '/cuadro peri/560cac14-6d08-4073-afba-c5bbb0927048.jpg',
    createdAt: '2024-04-01T10:00:00Z',
    // endDate: '2024-04-30T23:59:59Z',
    // drawDate: '2024-05-01T20:00:00Z',
    price: 35,
    totalTickets: 90,
    startNumber: 1,
    digits: 1,
    winningNumber: null,
    occupiedTickets: [],
    externalRegistrationLink: 'https://docs.google.com/spreadsheets/d/1Prn0G_-B663DU_EdXoDaNewCv0OwSxUBm9RPaVvevwA/edit?usp=sharing',
    hideRegistrationInfo: true,
    prizeInfo: 'Premio único: Cuadro "Peri"',
    prizeModalSubtitle: 'El ganador se llevará este cuadro exclusivo',
    prizeModalDescription: 'El ganador de este sorteo se llevará el cuadro "Peri" mostrado a continuación. Aquí puedes ver diferentes detalles y perspectivas de la obra.',
    // rules: {
    //   source: 'Lotería Nacional - Sorteo Superior (24 de Abril)',
    //   description: 'El último día para adquirir un boleto es el jueves 30 de abril. El ganador se determinará con las últimas 3 cifras del Premio Mayor del Sorteo Superior del viernes 1 de mayo.',
    //   fallback: 'Si no hay ganador exacto, el premio se asignará al número con menor diferencia absoluta. En caso de empate (equidistancia), ambos ganan y se daran 2 premios a cada uno.',
    // },
    seo: {
      title: 'Sorteo Super Peri - Cuadro 🖼️',
      description: 'Gana un cuadro exclusivo "Peri". ¡Participa ahora!',
      image: '/cuadro peri/560cac14-6d08-4073-afba-c5bbb0927048.jpg',
    },
    prizes: [
      {
        id: 'cuadro-peri-1',
        name: 'Cuadro Peri - Vista Principal',
        description: 'Pintura exclusiva "Peri", vista frontal completa.',
        image: '/cuadro peri/560cac14-6d08-4073-afba-c5bbb0927048.jpg'
      },
      {
        id: 'cuadro-peri-2',
        name: 'Cuadro Peri - Detalle 1',
        description: 'Detalle de la textura y colores del cuadro.',
        image: '/cuadro peri/283107e1-b630-4ae7-9f7f-9e1078d37e3c.jpg'
      },
      {
        id: 'cuadro-peri-3',
        name: 'Cuadro Peri - Detalle 2',
        description: 'Detalle de los trazos artísticos.',
        image: '/cuadro peri/32cb8edd-df68-40e0-b7a1-d521a33615c6.jpg'
      },
      {
        id: 'cuadro-peri-4',
        name: 'Cuadro Peri - Detalle 3',
        description: 'Detalle de la composición.',
        image: '/cuadro peri/4e964b5c-f59f-491b-acf7-c4ab5db8e4a2.jpg'
      },
      {
        id: 'cuadro-peri-5',
        name: 'Cuadro Peri - Detalle 4',
        description: 'Detalle de los pigmentos.',
        image: '/cuadro peri/d062e2d8-b292-4e3f-b3b9-a692449005c5.jpg'
      },
      {
        id: 'cuadro-peri-6',
        name: 'Cuadro Peri - Detalle 5',
        description: 'Vista en ángulo del cuadro.',
        image: '/cuadro peri/d414b759-1054-4f16-b1ea-66d70037f264.jpg'
      },
      {
        id: 'cuadro-peri-7',
        name: 'Cuadro Peri - Detalle 6',
        description: 'Detalle de la firma o textura.',
        image: '/cuadro peri/d7dd1e44-8267-4ede-ab01-846e879cb4ac.jpg'
      },
      {
        id: 'cuadro-peri-8',
        name: 'Cuadro Peri - Detalle 7',
        description: 'Otra perspectiva del cuadro.',
        image: '/cuadro peri/fe040cd3-977a-4ba9-ad7f-aa6ebec14407.jpg'
      }
    ]
  }
];
