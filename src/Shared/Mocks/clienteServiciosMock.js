export const mockVendiblesObject = {
  vendibles: {
    'Servicio de Plomería': [
      {
        vendibleId: 1,
        imagenUrl: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      },
      {
        vendibleId: 2,
        imagenUrl: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      },
      {
        vendibleId: 3,
        imagenUrl: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      },
    ],
    'Reparación de Electrodomésticos': [
      {
        vendibleId: 4,
        imagenUrl: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      },
      {
        vendibleId: 5,
        imagenUrl: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      },
      {
        vendibleId: 6,
        imagenUrl: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      },
    ],
    'Servicios de Jardinería': [
      {
        vendibleId: 7,
        imagenUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      },
      {
        vendibleId: 8,
        imagenUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      },
      {
        vendibleId: 9,
        imagenUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      },
    ],
  },
  categorias: {
    Hogar: {
      root: 'Hogar',
      children: [
        {
          root: 'Plomería',
          children: [
            { root: 'Reparación', children: [] },
            { root: 'Instalación', children: [] },
          ],
        },
        {
          root: 'Electricidad',
          children: [
            { root: 'Instalaciones', children: [] },
            { root: 'Reparaciones', children: [] },
          ],
        },
      ],
    },
    Exterior: {
      root: 'Exterior',
      children: [
        {
          root: 'Jardinería',
          children: [
            { root: 'Poda de árboles', children: [] },
            { root: 'Mantenimiento de césped', children: [] },
          ],
        },
        {
          root: 'Paisajismo',
          children: [
            { root: 'Diseño de jardines', children: [] },
            { root: 'Decoración de exteriores', children: [] },
          ],
        },
      ],
    },
    Tecnología: {
      root: 'Tecnología',
      children: [
        {
          root: 'Computación',
          children: [
            { root: 'Mantenimiento', children: [] },
            { root: 'Reparación de hardware', children: [] },
          ],
        },
        {
          root: 'Electrodomésticos',
          children: [
            { root: 'Reparación', children: [] },
            { root: 'Instalación', children: [] },
          ],
        },
      ],
    },
  },
};
