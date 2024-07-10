import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import BasicMenu from '../Shared/Components/Menu';
import { sharedLabels } from '../StaticData/Shared';
import SelectComponent from '../Shared/Components/Select';
import {
  EMPTY_FUNCTION,
  USUARIOS_TYPES,
} from '../Shared/Constants/System';
import Searcher from '../Shared/Components/Searcher';
import { getPlanId } from '../Shared/Helpers/PlanesHelper';
import { planShape } from '../Shared/PropTypes/Proveedor';

const { plansNames } = sharedLabels;

function getMenuOption({
  component, props, onClick, label,
}) {
  return {
    component,
    props,
    onClick,
    label,
  };
}

function UsuariosAdminFilters({
  usuarioTypeFilter, applyFilters, planesInfo,
  setUsuarioTypeFilter, filters, setFilters,
}) {
  const onChangeName = (name) => setFilters('name', name);

  const onChangeSurname = (surname) => setFilters('surname', surname);

  const onChangeEmail = (email) => setFilters('email', email);

  const onChangeOnlyActives = (value) => setFilters('showOnlyActives', value);

  const onChangePlan = (value) => {
    const planType = Object.keys(plansNames)
      .find((key) => plansNames[key] === value);

    const planId = getPlanId(planesInfo, planType);

    if (filters.plan !== planId) {
      setFilters('plan', planType !== plansNames.ALL ? planId : '');
    }
  };

  const memoizedMenuOptions = useMemo(() => {
    const menuOptions = [
      getMenuOption({
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
      }),
      getMenuOption({
        component: Searcher,
        props: {
          inputValue: filters.name,
          searchLabel: sharedLabels.name,
          onSearchClick: applyFilters,
          isSearchDisabled: !(filters.name),
          keyEvents: {
            onKeyUp: onChangeName,
          },
        },
        onClick: undefined,
      }),
      getMenuOption({
        component: Searcher,
        props: {
          inputValue: filters.surname,
          searchLabel: sharedLabels.surname,
          onSearchClick: applyFilters,
          isSearchDisabled: !(filters.surname),
          keyEvents: {
            onKeyUp: onChangeSurname,
          },
        },
        onClick: undefined,
      }),
      getMenuOption({
        component: Searcher,
        props: {
          inputValue: filters.email,
          searchLabel: sharedLabels.email,
          onSearchClick: applyFilters,
          isSearchDisabled: !(filters.email),
          keyEvents: {
            onKeyUp: onChangeEmail,
          },
        },
        onClick: undefined,
      }),
      getMenuOption({
        component: Checkbox,
        props: {
          checked: filters.showOnlyActives,
          onChange: (event) => onChangeOnlyActives(event.target.checked),
        },
        label: sharedLabels.onlyActiveUsers,
      }),
    ];

    if (usuarioTypeFilter === 'proveedores') {
      const planSelectValues = [plansNames.ALL, plansNames.FREE, plansNames.PAID];

      const selectedType = planesInfo.find((plan) => plan.id === filters.plan)?.type ?? '';

      const defaultSelected = selectedType ? planSelectValues.indexOf(plansNames[selectedType]) : 0;

      menuOptions.splice(1, 0, {
        component: SelectComponent,
        props: {
          label: sharedLabels.plan,
          containerStyles: { width: '20rem' },
          title: sharedLabels.plan,
          values: planSelectValues,
          handleOnChange: onChangePlan,
          defaultSelected,
        },
        onClick: undefined,
      });
    }

    return menuOptions;
  }, [usuarioTypeFilter, filters]);

  return (
    <BasicMenu
      styles={{ color: '#1976d2', display: 'flex', flexDirection: 'row' }}
      buttonLabel={sharedLabels.filters}
      options={memoizedMenuOptions}
    />

  );
}

UsuariosAdminFilters.propTypes = {
  usuarioTypeFilter: PropTypes.oneOf(['proveedores', 'clientes']).isRequired,
  applyFilters: PropTypes.func.isRequired,
  planesInfo: PropTypes.arrayOf(PropTypes.shape(planShape)).isRequired,
  setUsuarioTypeFilter: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    name: PropTypes.string,
    surname: PropTypes.string,
    email: PropTypes.string,
    showOnlyActives: PropTypes.bool,
    plan: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default UsuariosAdminFilters;
