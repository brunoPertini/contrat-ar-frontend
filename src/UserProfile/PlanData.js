import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { sharedLabels } from '../StaticData/Shared';
import { PLAN_TYPE_FREE } from '../Shared/Constants/System';
import LocationMap from '../Shared/Components/LocationMap';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import SelectComponent from '../Shared/Components/Select';
import { userProfileLabels } from '../StaticData/UserProfile';
import InformativeAlert from '../Shared/Components/Alert';
import { planShape } from '../Shared/PropTypes/Proveedor';
import { getPlanDescription } from '../Shared/Helpers/PlanesHelper';

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
        { getPlanDescription(plan, planesInfo, true) }
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
