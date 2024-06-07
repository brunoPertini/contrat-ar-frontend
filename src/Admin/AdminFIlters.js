/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Box from '@mui/material/Box';
import { useState } from 'react';
import { CheckBoxGroup } from '../Shared/Components';
import BasicMenu from '../Shared/Components/Menu';
import { sharedLabels } from '../StaticData/Shared';
import SelectComponent from '../Shared/Components/Select';
import { USUARIOS_TYPES } from '../Shared/Constants/System';

export default function AdminFilters({ usuarioTypeFilter, setUsuarioTypeFilter }) {
  return (
    <BasicMenu
      styles={{ color: '#1976d2', display: 'flex', flexDirection: 'row' }}
      buttonLabel={sharedLabels.filters}
      options={[{
        component: SelectComponent,
        props: {
          label: 'Tipo de usuario: ',
          containerStyles: { width: '20rem' },
          title: sharedLabels.userType,
          values: USUARIOS_TYPES,
          handleOnChange: setUsuarioTypeFilter,
          defaultSelected: USUARIOS_TYPES.indexOf(usuarioTypeFilter),
        },
        onClick: () => {},
      }]}
    />

  );
}
