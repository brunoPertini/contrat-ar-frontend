export const proveedorVendiblesResponse = {
  vendibles: [
    {
      vendibleId: 1,
      vendibleNombre: 'Plomería Profesional',
      imagenUrl: 'https://source.unsplash.com/400x300/?plumbing',
      state: 'ACTIVE',
    },
    {
      vendibleId: 2,
      vendibleNombre: 'Arte Abstracto',
      imagenUrl: 'https://source.unsplash.com/400x300/?abstract-art',
      state: 'ACTIVE',
    },
    {
      vendibleId: 3,
      vendibleNombre: 'Reparación de Electrodomésticos',
      imagenUrl: 'https://source.unsplash.com/400x300/?appliances-repair',
      state: 'ACTIVE',
    },
    {
      vendibleId: 4,
      vendibleNombre: 'Clases de Música',
      imagenUrl: 'https://source.unsplash.com/400x300/?music-lessons',
      state: 'ACTIVE',
    },
    {
      vendibleId: 5,
      vendibleNombre: 'Diseño Gráfico',
      imagenUrl: 'https://source.unsplash.com/400x300/?graphic-design',
      state: 'ACTIVE',
    },
    {
      vendibleId: 6,
      vendibleNombre: 'Servicio de Jardinería',
      imagenUrl: 'https://source.unsplash.com/400x300/?gardening',
      state: 'ACTIVE',
    },
    {
      vendibleId: 7,
      vendibleNombre: 'Asesoría Legal',
      imagenUrl: 'https://source.unsplash.com/400x300/?legal-advice',
      state: 'ACTIVE',
    },
    {
      vendibleId: 8,
      vendibleNombre: 'Entrenador Personal',
      imagenUrl: 'https://source.unsplash.com/400x300/?personal-trainer',
      state: 'ACTIVE',
    },
  ],
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
