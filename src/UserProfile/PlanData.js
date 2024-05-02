/* eslint-disable react/prop-types */
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { sharedLabels } from '../StaticData/Shared';
import { PLAN_TYPE_FREE, PLAN_TYPE_PAID } from '../Shared/Constants/System';
import { LocationMap } from '../Shared/Components';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import SelectComponent from '../Shared/Components/Select';
import { userProfileLabels } from '../StaticData/UserProfile';

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
      </Typography>),
  };

  return PLAN_DESCRIPTIONS[plan];
}

function PlanData({
  plan, styles, userLocation, changeUserInfo,
}) {
  const { plansNames } = sharedLabels;

  const onPlanChange = (newPlan) => changeUserInfo(Object.keys(plansNames)
    .find((key) => plansNames[key] === newPlan));

  return (
    <Box display="flex" flexDirection="column" sx={{ ...styles }}>
      <SelectComponent
        values={[sharedLabels.plansNames.FREE, sharedLabels.plansNames.PAID]}
        containerStyles={{ width: '31rem', mt: '5%' }}
        handleOnChange={onPlanChange}
        label={userProfileLabels['plan.label']}
      />
      { getPlanDescription(plan) }
      <LocationMap
        circleRadius={1500}
        location={parseLocationForMap(userLocation)}
        containerStyles={{
          height: '500px',
          width: '100%',
          marginTop: '5%',
        }}
      />
    </Box>
  );
}

export default PlanData;
