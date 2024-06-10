/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Box from '@mui/material/Box';
import { useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { CheckBoxGroup } from '../Shared/Components';
import BasicMenu from '../Shared/Components/Menu';
import { sharedLabels } from '../StaticData/Shared';
import SelectComponent from '../Shared/Components/Select';
import { EMPTY_FUNCTION, USUARIOS_TYPES } from '../Shared/Constants/System';
import Searcher from '../Shared/Components/Searcher';

export default function AdminFilters({
  usuarioTypeFilter, applyFilters,
  setUsuarioTypeFilter, filters, setFilters,
}) {
  const onChangeName = (name) => setFilters('name', name);

  const onChangeSurname = (surname) => setFilters('surname', surname);

  return (
    <BasicMenu
      styles={{ color: '#1976d2', display: 'flex', flexDirection: 'row' }}
      buttonLabel={sharedLabels.filters}
      options={[{
        component: SelectComponent,
        props: {
          label: sharedLabels.userType,
          containerStyles: { width: '20rem' },
          title: sharedLabels.userType,
          values: USUARIOS_TYPES,
          handleOnChange: setUsuarioTypeFilter,
          defaultSelected: USUARIOS_TYPES.indexOf(usuarioTypeFilter),
        },
        onClick: EMPTY_FUNCTION,
      },
      {
        component: Searcher,
        props: {
          inputValue: filters.name,
          searchLabel: sharedLabels.name,
          onSearchClick: applyFilters,
          isSearchDisabled: false,
          autoFocus: true,
          keyEvents: {
            onKeyUp: onChangeName,
          },
        },
        onClick: undefined,
      },
      {
        component: Searcher,
        props: {
          inputValue: filters.surname,
          searchLabel: sharedLabels.surname,
          onSearchClick: applyFilters,
          isSearchDisabled: false,
          autoFocus: true,
          keyEvents: {
            onKeyUp: onChangeSurname,
          },
        },
        onClick: undefined,
      }]}
    />

  );
}
