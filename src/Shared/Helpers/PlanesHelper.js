import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import { userProfileLabels } from '../../StaticData/UserProfile';
import { sharedLabels } from '../../StaticData/Shared';
import { PLAN_TYPE_PAID, PLAN_TYPE_FREE, ARGENTINA_LOCALE } from '../Constants/System';
import { getLocaleCurrencySymbol } from './PricesHelper';
import { flexRow } from '../Constants/Styles';

function renderCurrentPromotionInfo(promotionInfo) {
  return (
    <Box {...flexRow} textAlign="left" justifyContent="space-between">
      <Typography variant="h5">¡Tenés aplicada esta promoción!</Typography>
      <span dangerouslySetInnerHTML={{ __html: promotionInfo.text }} />
    </Box>
  );
}

export function getPlanDescription(plan, planesDescriptions, showDisclaimer, promotionInfo) {
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
      <>
        <Typography variant="h5">
          {userProfileLabels['plan.includes']}
        </Typography>
        <Typography paragraph variant="body" sx={{ mt: '1%' }}>
          {renderPlanDescription()}
        </Typography>
      </>),
    [PLAN_TYPE_PAID]: (
      <>
        <Typography variant="h5">
          {userProfileLabels['plan.includes']}
        </Typography>
        <Typography paragraph variant="body" sx={{ mt: '1%' }}>
          {renderPlanDescription()}
          {!!promotionInfo && renderCurrentPromotionInfo(promotionInfo)}
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

export function renderPlanPrice(plan) {
  if (plan.type === PLAN_TYPE_FREE || plan.price === plan.priceWithDiscount) {
    return (
      <Typography variant="h6" color="primary" sx={{ my: 2 }}>
        {sharedLabels.finalMonthlyPrice}
        {getLocaleCurrencySymbol(ARGENTINA_LOCALE) + plan.price}
      </Typography>
    );
  }

  return (
    <Typography variant="h6" color="primary" sx={{ my: 2 }}>
      { sharedLabels.finalMonthlyPrice }
      <Box component="span" sx={{ textDecoration: 'line-through', mr: 1 }}>
        {getLocaleCurrencySymbol(ARGENTINA_LOCALE)}
        {plan.price}
      </Box>
      <Box component="span" sx={{ fontWeight: 'bold' }}>
        {getLocaleCurrencySymbol(ARGENTINA_LOCALE)}
        {plan.priceWithDiscount}
      </Box>
    </Typography>
  );
}

export const renderPromotionsInfo = (promotionsInfo) => promotionsInfo.map((info) => (
  <Box {...flexRow} textAlign="left">
    <CheckIcon sx={{ mr: '1px' }} />
    <span dangerouslySetInnerHTML={{ __html: info.text }} />
    <br />
    <br />
  </Box>
));

export const getPlanByType = (planesInfo, planType) => planesInfo.find(
  (planInfo) => planInfo.type === planType,
);

export const getPlanId = (planesInfo, planType) => planesInfo.find(
  (planInfo) => planInfo.type === planType,
)?.id ?? '';

export const getPlanType = (planesInfo, planId) => planesInfo.find(
  (planInfo) => planInfo.id === planId,
)?.type;

export const getPlanLabel = (planId) => (planId === 1
  ? sharedLabels.plansNames.FREE
  : sharedLabels.plansNames.PAID);

export const getPlanValue = (planesInfo, planType) => planesInfo.find(
  (planInfo) => planInfo.type === planType,
)?.price ?? '';
