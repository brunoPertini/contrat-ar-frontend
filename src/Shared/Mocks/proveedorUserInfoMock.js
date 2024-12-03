export const proveedorUserInfoMock = {
  id: 1,
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@example.com',
  birthDate: '1990-01-01',
  location: {
    coordinates: [-34.9200364392778, -57.9542080490215],
  },
  role: 'PROVEEDOR_SERVICIOS',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  indexPage: '/cliente',
  phone: '+541100000000',
  password: 'securePassword123',
  plan: 'FREE',
  dni: '12345678',
  authorities: ['ROLE_PROVEEDOR_SERVICIOS'],
  suscripcion: {
    id: 1,
    planId: 1,
    isActive: true,
    createdDate: '1/2/2024',
  },
};
