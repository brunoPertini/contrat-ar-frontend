/* eslint-disable no-unused-vars */
import Box from '@mui/material/Box';
import { useState } from 'react';
import { CheckBoxGroup } from '../Shared/Components';

const USUARIOS_TYPES = ['clientes', 'proveedores'];

export default function AdminFilters() {
  const [usuarioTypeFilter, setUsuarioTypeFilter] = useState();

  return (
    <CheckBoxGroup
      title="Tipo de usuario"
      elements={USUARIOS_TYPES}
      handleChange={setUsuarioTypeFilter}
    />
  );
}
