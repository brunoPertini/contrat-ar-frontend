export const proveedorVendiblesResponse = {
  vendibles: [
    {
      vendibleId: 1,
      vendibleNombre: 'Plomería Profesional',
      imagenUrl: 'https://samsungar.vtexassets.com/arquivos/ids/168432-800-auto',
      state: 'ACTIVE',
    },
    {
      vendibleId: 2,
      vendibleNombre: 'Arte Abstracto',
      imagenUrl: 'https://samsungar.vtexassets.com/arquivos/ids/168432-800-auto',
      state: 'ACTIVE',
    },
    {
      vendibleId: 3,
      vendibleNombre: 'Reparación de Electrodomésticos',
      imagenUrl: 'https://samsungar.vtexassets.com/arquivos/ids/168432-800-auto',
      state: 'ACTIVE',
    },
    {
      vendibleId: 4,
      vendibleNombre: 'Clases de Música',
      imagenUrl: 'https://samsungar.vtexassets.com/arquivos/ids/168432-800-auto',
      state: 'ACTIVE',
    },
    {
      vendibleId: 5,
      vendibleNombre: 'Diseño Gráfico',
      imagenUrl: 'https://samsungar.vtexassets.com/arquivos/ids/168432-800-auto',
      state: 'ACTIVE',
    },
    {
      vendibleId: 6,
      vendibleNombre: 'Servicio de Jardinería',
      imagenUrl: 'https://samsungar.vtexassets.com/arquivos/ids/168432-800-auto',
      state: 'ACTIVE',
    },
    {
      vendibleId: 7,
      vendibleNombre: 'Asesoría Legal',
      imagenUrl: 'https://samsungar.vtexassets.com/arquivos/ids/168432-800-auto',
      state: 'ACTIVE',
    },
    {
      vendibleId: 8,
      vendibleNombre: 'Entrenador Personal',
      imagenUrl: 'https://samsungar.vtexassets.com/arquivos/ids/168432-800-auto',
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
