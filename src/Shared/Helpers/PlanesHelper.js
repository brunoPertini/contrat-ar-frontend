import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import { getLocaleCurrencySymbol } from './PricesHelper';
import { userProfileLabels } from '../../StaticData/UserProfile';
import { sharedLabels } from '../../StaticData/Shared';
import { ARGENTINA_LOCALE, PLAN_TYPE_PAID, PLAN_TYPE_FREE } from '../Constants/System';

export function getPlanDescription(plan, planesDescriptions, showDisclaimer) {
  const currentPlanInfo = planesDescriptions.find((planInfo) => planInfo.type === plan);

  const renderDescripctionLine = (innerContent) => (
    <Box display="flex" flexDirection="row" alignItems="center">
      { innerContent}
    </Box>
  );

  const renderPlanDescription = () => currentPlanInfo.descripcion.split('.')
    .filter((line) => !!(line))
    .map((line) => renderDescripctionLine(
      <>
        <CheckIcon />
        { line }
        <br />
      </>,
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
