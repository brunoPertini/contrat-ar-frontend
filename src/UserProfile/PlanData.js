import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';
import { sharedLabels } from '../StaticData/Shared';
import {
  ARGENTINA_LOCALE,
  PLAN_TYPE_FREE, PLAN_TYPE_PAID,
} from '../Shared/Constants/System';
import LocationMap from '../Shared/Components/LocationMap';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import SelectComponent from '../Shared/Components/Select';
import { userProfileLabels } from '../StaticData/UserProfile';
import InformativeAlert from '../Shared/Components/Alert';
import { getLocaleCurrencySymbol } from '../Shared/Helpers/PricesHelper';
import { planShape } from '../Shared/PropTypes/Proveedor';

function getPlanDescription(plan, planesDescriptions) {
  const currentPlanInfo = planesDescriptions.find((planInfo) => planInfo.type === plan);

  const renderPlanDescription = () => currentPlanInfo.descripcion.split('.')
    .filter((line) => !!(line))
    .map((line) => (
      <>
        <CheckIcon />
        { line }
        .
        <br />
      </>
    ));

  const PLAN_DESCRIPTIONS = {
    [PLAN_TYPE_FREE]: (
      <Typography paragraph variant="body" sx={{ mt: '5%' }}>
        { userProfileLabels['plan.includes'] }
        <br />
        <br />
        {
          renderPlanDescription()
        }
      </Typography>),
    [PLAN_TYPE_PAID]: (
      <>
        <Typography paragraph variant="body" sx={{ mt: '5%' }}>
          { userProfileLabels['plan.includes'] }
          <br />
          <br />
          {
            renderPlanDescription()
          }
        </Typography>
        <Typography variant="h5" sx={{ mt: '5%' }}>
          { sharedLabels.finalMonthlyPrice.replace(
            '{price}',
            getLocaleCurrencySymbol(ARGENTINA_LOCALE) + currentPlanInfo.price,
          )}
          <br />
          <br />
        </Typography>
      </>),
  };

  return (
    <Typography paragraph variant="body">
      {PLAN_DESCRIPTIONS[plan]}
      <InfoIcon />
      {' '}
      { userProfileLabels['plan.change.disclaimer'] }
    </Typography>
  );
}

function PlanData({
  plan, styles, userLocation, changeUserInfo, planesInfo,
  actualPlan, confirmPlanChange, planRequestChangeExists,
}) {
  const { plansNames } = sharedLabels;

  const onPlanChange = (newPlan) => changeUserInfo(Object.keys(plansNames)
    .find((key) => plansNames[key] === newPlan));

  const [hasPendingRequest, setHasPendingRequest] = useState(planRequestChangeExists);

  const handleConfirmPlan = () => {
    confirmPlanChange(plan).then(() => setHasPendingRequest(true));
  };

  return (
    <Box display="flex" flexDirection="row" sx={{ ...styles }}>
      <Box display="flex" flexDirection="column">
        <SelectComponent
          defaultSelected={actualPlan === PLAN_TYPE_FREE ? 0 : 1}
          values={[sharedLabels.plansNames.FREE, sharedLabels.plansNames.PAID]}
          containerStyles={{ width: '31rem', mt: '5%' }}
          handleOnChange={onPlanChange}
          label={userProfileLabels['plan.label']}
          renderValue={(value) => (value === plansNames[actualPlan] ? `${value} (Tu plan actual)` : value)}
          disabled={planRequestChangeExists || hasPendingRequest}
        />
        { getPlanDescription(plan, planesInfo) }
        {
        plan === PLAN_TYPE_FREE && (
          <LocationMap
            enableDragEvents={false}
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
              onClick={() => handleConfirmPlan()}
            >
              { sharedLabels.saveChanges }
            </Button>
          </Box>
        )
      }
      <InformativeAlert
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={hasPendingRequest || planRequestChangeExists}
        label={userProfileLabels['plan.change.finalMessage']}
        severity="info"
      />
    </Box>
  );
}

PlanData.defaultProps = {
  styles: {},
};

PlanData.propTypes = {
  plan: PropTypes.oneOf(['FREE', 'PAID']).isRequired,
  styles: PropTypes.object,
  userLocation: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  changeUserInfo: PropTypes.func.isRequired,
  confirmPlanChange: PropTypes.func.isRequired,
  planesInfo: PropTypes.arrayOf(PropTypes.shape(planShape)).isRequired,
  planRequestChangeExists: PropTypes.bool.isRequired,
  actualPlan: PropTypes.oneOf(['FREE', 'PAID']).isRequired,
};

export default PlanData;
