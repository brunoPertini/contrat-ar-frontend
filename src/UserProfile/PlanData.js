/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Button, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';
import { sharedLabels } from '../StaticData/Shared';
import { ARGENTINA_LOCALE, PLAN_TYPE_FREE, PLAN_TYPE_PAID } from '../Shared/Constants/System';
import { LocationMap } from '../Shared/Components';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import SelectComponent from '../Shared/Components/Select';
import { userProfileLabels } from '../StaticData/UserProfile';
import InformativeAlert from '../Shared/Components/Alert';
import { getLocaleCurrencySymbol } from '../Shared/Helpers/PricesHelper';

function getPlanDescription(plan) {
  const PLAN_DESCRIPTIONS = {
    [PLAN_TYPE_FREE]: (
      <Typography paragraph variant="body" sx={{ mt: '5%' }}>
        Tu plan incluye:
        {' '}
        <br />
        <CheckIcon />
        {' '}
        Cualquier persona en el radio de alcance que muestra el mapa te va a poder encontrar.
      </Typography>),
    [PLAN_TYPE_PAID]: (
      <>
        <Typography paragraph variant="body" sx={{ mt: '5%' }}>
          Tu plan incluye:
          {' '}
          <br />
          <CheckIcon />
          {' '}
          Un radio de alcance completo para que cualquier persona en tu país te pueda encontrar.
          <br />
          <CheckIcon />
          {' '}
          Un perfil completamente personalizado, donde vas a poder subir tus trabajos hechos, y
          recibir la opinión sobre ellos de tus clientes.
          <br />
          <CheckIcon />
          {' '}
          La posibilidad de tener un multiperfil, y que así no solo puedas vender productos
          o servicios, sino hacer ambas cosas.
        </Typography>
        <Typography variant="h5" sx={{ mt: '5%' }}>
          Precio final mensual:
          {' '}
          { getLocaleCurrencySymbol(ARGENTINA_LOCALE)}
          500
          <br />
          <br />
          <InfoIcon />
          {' '}
          Nos vamos a comunicar al mail o celular que nos diste para
          acordar la forma de pago y completar el proceso.
        </Typography>
      </>),
  };

  return PLAN_DESCRIPTIONS[plan];
}

function PlanData({
  plan, styles, userLocation, changeUserInfo, actualPlan,
}) {
  const { plansNames } = sharedLabels;

  const onPlanChange = (newPlan) => changeUserInfo(Object.keys(plansNames)
    .find((key) => plansNames[key] === newPlan));

  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  return (
    <Box display="flex" flexDirection="row" sx={{ ...styles }}>
      <Box display="flex" flexDirection="column">
        <SelectComponent
          values={[sharedLabels.plansNames.FREE, sharedLabels.plansNames.PAID]}
          containerStyles={{ width: '31rem', mt: '5%' }}
          handleOnChange={onPlanChange}
          label={userProfileLabels['plan.label']}
          renderValue={(value) => (value === plansNames[actualPlan] ? `${value} (Tu plan actual)` : value)}
        />
        { getPlanDescription(plan) }
        {
        plan === 'FREE' && (
          <LocationMap
            circleRadius={1500}
            location={parseLocationForMap(userLocation)}
            containerStyles={{
              height: '500px',
              width: '100%',
              marginTop: '5%',
            }}
          />
        )
      }
      </Box>
      {
        !hasPendingRequest && (
          <Box display="flex" flexDirection="column">
            <Button
              variant="contained"
              sx={{ mt: '5%' }}
              disabled={actualPlan === plan}
              onClick={() => setHasPendingRequest(true)}
            >
              { sharedLabels.saveChanges }
            </Button>
          </Box>
        )
      }
      <InformativeAlert
        open={hasPendingRequest}
        label="Recibimos tu solicitud de cambio de plan! Te contactaremos a la brevedad"
        severity="info"
      />
    </Box>
  );
}

export default PlanData;
