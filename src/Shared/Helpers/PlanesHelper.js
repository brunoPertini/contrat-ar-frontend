import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import { userProfileLabels } from '../../StaticData/UserProfile';
import { sharedLabels } from '../../StaticData/Shared';
import { PLAN_TYPE_PAID, PLAN_TYPE_FREE } from '../Constants/System';
import { flexRow } from '../Constants/Styles';

export function getPlanDescription(plan, planesDescriptions, showDisclaimer) {
  const currentPlanInfo = planesDescriptions.find((planInfo) => planInfo.type === plan);

  const renderDescripctionLine = (innerContent) => (
    <Box {...flexRow}>
      { innerContent}
    </Box>
  );

  const renderPlanDescription = () => currentPlanInfo.descripcion.split('.')
    .filter((line) => !!(line))
    .map((line) => renderDescripctionLine(
      <Box {...flexRow} textAlign="left" justifyContent="space-between">
        <CheckIcon sx={{ mr: '1px' }} />
        { line }
        <br />
        <br />
      </Box>,
    ));

  const PLAN_DESCRIPTIONS = {
    [PLAN_TYPE_FREE]: (
      <Typography paragraph variant="body" sx={{ mt: '2%' }}>
        { userProfileLabels['plan.includes'] }
        <br />
        <br />
        {
            renderPlanDescription()
          }
      </Typography>),
    [PLAN_TYPE_PAID]: (
      <Typography paragraph variant="body" sx={{ mt: '2%' }}>
        { userProfileLabels['plan.includes'] }
        <br />
        <br />
        {
              renderPlanDescription()
            }
      </Typography>),
  };

  const disclaimer = showDisclaimer ? (
    renderDescripctionLine(
      <>
        <InfoIcon />
        {userProfileLabels['plan.change.disclaimer']}
      </>,
    )
  ) : null;
  return (
    <Typography paragraph variant="body">
      {PLAN_DESCRIPTIONS[plan]}
      { disclaimer }
    </Typography>
  );
}

export const getPlanId = (planesInfo, planType) => planesInfo.find(
  (planInfo) => planInfo.type === planType,
)?.id ?? '';

export const getPlanType = (planesInfo, planId) => planesInfo.find(
  (planInfo) => planInfo.id === planId,
).type;

export const getPlanLabel = (planId) => (planId === 1
  ? sharedLabels.plansNames.FREE
  : sharedLabels.plansNames.PAID);

export const getPlanValue = (planesInfo, planType) => planesInfo.find(
  (planInfo) => planInfo.type === planType,
)?.value ?? '';
