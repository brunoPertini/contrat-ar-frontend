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
  PAID_PLAN_PRICE, PLAN_TYPE_FREE, PLAN_TYPE_PAID,
} from '../Shared/Constants/System';
import LocationMap from '../Shared/Components/LocationMap';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import SelectComponent from '../Shared/Components/Select';
import { userProfileLabels } from '../StaticData/UserProfile';
import InformativeAlert from '../Shared/Components/Alert';
import { getLocaleCurrencySymbol } from '../Shared/Helpers/PricesHelper';

function getPlanDescription(plan) {
  const renderPlanDescription = (toRenderPlan) => userProfileLabels[`plan.${toRenderPlan}.description`]
    .split('.')
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
          renderPlanDescription(plan)
        }
      </Typography>),
    [PLAN_TYPE_PAID]: (
      <>
        <Typography paragraph variant="body" sx={{ mt: '5%' }}>
          { userProfileLabels['plan.includes'] }
          <br />
          <br />
          {
            renderPlanDescription(plan)
          }
        </Typography>
        <Typography variant="h5" sx={{ mt: '5%' }}>
          { sharedLabels.finalMonthlyPrice.replace(
            '{price}',
            getLocaleCurrencySymbol(ARGENTINA_LOCALE) + PAID_PLAN_PRICE,
          )}
          <br />
          <br />
          <InfoIcon />
          {' '}
          { userProfileLabels['plan.change.disclaimer'] }
        </Typography>
      </>),
  };

  return PLAN_DESCRIPTIONS[plan];
}

function PlanData({
  plan, styles, userLocation, changeUserInfo,
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
  planRequestChangeExists: PropTypes.bool.isRequired,
  actualPlan: PropTypes.oneOf(['FREE', 'PAID']).isRequired,
};

export default PlanData;
