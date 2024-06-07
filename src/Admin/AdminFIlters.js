/* eslint-disable no-unused-vars */
import Box from '@mui/material/Box';
import { useState } from 'react';
import { CheckBoxGroup } from '../Shared/Components';
import BasicMenu from '../Shared/Components/Menu';
import { sharedLabels } from '../StaticData/Shared';

const USUARIOS_TYPES = ['clientes', 'proveedores'];

export default function AdminFilters() {
  const [usuarioTypeFilter, setUsuarioTypeFilter] = useState();

  return (
    <BasicMenu
      styles={{ color: '#1976d2', display: 'flex', flexDirection: 'row' }}
      buttonLabel={sharedLabels.filters}
      options={[{
        component: CheckBoxGroup,
        props: {
          title: sharedLabels.userType,
          elements: USUARIOS_TYPES,
          handleChange: setUsuarioTypeFilter,
        },
      }]}
    />

  );
}
