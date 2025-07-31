import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import useMediaQuery from '@mui/material/useMediaQuery';
import isEmpty from 'lodash/isEmpty';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { sharedLabels } from '../StaticData/Shared';
import { PLAN_TYPE_FREE, PLAN_TYPE_PAID } from '../Shared/Constants/System';
import LocationMap from '../Shared/Components/LocationMap';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import SelectComponent from '../Shared/Components/Select';
import { userProfileLabels } from '../StaticData/UserProfile';
import { planShape, suscriptionShape } from '../Shared/PropTypes/Proveedor';
import { getPlanDescription, renderPromotionsInfo } from '../Shared/Helpers/PlanesHelper';
import StaticAlert from '../Shared/Components/StaticAlert';
import Disclaimer from '../Shared/Components/Disclaimer';
import { flexColumn } from '../Shared/Constants/Styles';
import Layout from '../Shared/Components/Layout';
import DialogModal from '../Shared/Components/DialogModal';
import { TABS_NAMES } from './Constants';
import InformativeAlert from '../Shared/Components/Alert';

function PlanData({
  plan, styles, userLocation, changeUserInfo, planesInfo,
  actualPlan, confirmPlanChange, planRequestChangeExists,
  suscripcionData, cancelPlanChange, paySubscription, getSitePromotions,
}) {
  const { plansNames } = sharedLabels;

  const { validity: { valid, expirationDate } } = suscripcionData;

  const [showPlanDisclaimer, setShowPlanDisclaimer] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(planRequestChangeExists);

  const [isLoading, setIsLoading] = useState(false);

  const [modalContent,
    setModalContent] = useState({
    open: false,
    title: null,
    contextText: null,
    onClose: () => setModalContent((previous) => ({
      ...previous,
      open: false,
    })),
  });

  const [informativeAlertData, setInformativeAlertData] = useState({
    open: false,
    severity: '',
    label: '',
  });

  const [promotionsInfo, setPromotionsInfo] = useState([]);

  const isChangingPlan = useMemo(() => actualPlan && plan && plan !== actualPlan, [plan, actualPlan]);

  useEffect(() => () => {
    changeUserInfo(actualPlan);
  }, []);

  useEffect(() => {
    setHasPendingRequest(planRequestChangeExists);
  }, [planRequestChangeExists]);

  const handleSetPromotionsInfo = useCallback(async () => {
    const newPromotionsInfo = await getSitePromotions();
    setPromotionsInfo([...newPromotionsInfo]);
  }, [getSitePromotions]);

  useEffect(() => {
    if (isChangingPlan && plan === PLAN_TYPE_PAID) {
      handleSetPromotionsInfo();
    }
  }, [isChangingPlan]);

  const openCancelPlanDialogModal = useCallback(() => {
    setModalContent((previous) => ({
      ...previous,
      title: userProfileLabels['plan.change.cancel'],
      contextText: userProfileLabels['plan.change.cancel.text'],
      open: true,
    }));
  }, [setModalContent]);

  const closeDialogModal = useCallback(() => setModalContent((previous) => ({
    ...previous,
    open: false,
  })), [setModalContent]);

  const onPlanChange = (newPlan) => {
    const newPlanKey = Object.keys(plansNames)
      .find((key) => plansNames[key] === newPlan);

    setShowPlanDisclaimer(true);

    changeUserInfo(newPlanKey);
  };

  const cancelIsLoading = () => {
    setIsLoading(false);
  };

  const currentPlanInfo = useMemo(() => planesInfo.find((planInfo) => planInfo.type === plan), [planesInfo, plan]);

  const planChangeHandlers = {
    [PLAN_TYPE_FREE]: () => {
      setIsLoading(true);
      setShowPlanDisclaimer(false);
      confirmPlanChange(plan).then(() => {
        setHasPendingRequest(true);
        return Promise.resolve();
      }).catch(cancelIsLoading)
        .finally(cancelIsLoading);
    },

    [PLAN_TYPE_PAID]: async () => {
      setIsLoading(true);
      setShowPlanDisclaimer(false);
      let subscriptionData = null;
      try {
        subscriptionData = await confirmPlanChange(plan, currentPlanInfo.applicablePromotion);
      } catch (e) {
        cancelIsLoading();
      }

      if (currentPlanInfo.priceWithDiscount !== 0) {
        paySubscription(subscriptionData.id, TABS_NAMES.PLAN).then((checkoutUrl) => {
          window.location.href = checkoutUrl;
        }).catch(cancelIsLoading);
      }

      cancelIsLoading();
    },

  };

  const cleanInformativeAlertInfo = useCallback(() => {
    setInformativeAlertData((previous) => ({
      ...previous, label: '', severity: '', open: false,
    }));
  }, [setInformativeAlertData]);

  const handlePlanCancel = useCallback(() => {
    setIsLoading(true);
    cancelPlanChange()
      .then(() => {
        setInformativeAlertData((previous) => ({
          ...previous,
          open: true,
          severity: 'success',
          label: userProfileLabels['plan.change.cancel.success'],
        }));
      })
      .catch(() => {
        setInformativeAlertData((previous) => ({
          ...previous,
          open: true,
          severity: 'error',
          label: userProfileLabels['plan.change.cancel.error'],
        }));
      })
      .finally(() => {
        closeDialogModal();
        setIsLoading(false);
      });
  }, [cancelPlanChange]);

  const promotionInfo = useMemo(() => (!isEmpty(suscripcionData.promotionInfo) ? suscripcionData.promotionInfo : null), [suscripcionData]);

  const saveChangesButtonLabel = useMemo(() => {
    if (plan === PLAN_TYPE_FREE) {
      return sharedLabels.saveChanges;
    }

    const hasApplicablePromotion = !!(currentPlanInfo.applicablePromotion);

    const isNotFullDiscountPromotion = (hasApplicablePromotion && currentPlanInfo.priceWithDiscount);

    if (!hasApplicablePromotion || isNotFullDiscountPromotion) {
      return userProfileLabels['pay.amount'].replace('{amount}', currentPlanInfo.priceWithDiscount);
    }

    return userProfileLabels['plan.change.save.withPromotion'];
  }, [currentPlanInfo]);

  const { subscriptionAlertSeverity, subscriptionAlertLabel } = useMemo(() => ({
    subscriptionAlertSeverity: valid ? 'success' : 'error',
    subscriptionAlertLabel: valid
      ? userProfileLabels['plan.subscription.activeFrom'].replace('{createdAt}', suscripcionData.createdDate)
      : userProfileLabels['plan.subscription.invalid'],
  }), [suscripcionData]);

  const isLayourNearTabletSize = useMediaQuery('(max-width: 700px');

  const planChangedPending = useMemo(
    () => (hasPendingRequest || planRequestChangeExists),
    [hasPendingRequest, planRequestChangeExists],
  );

  const cancelPlanLink = planChangedPending
    ? (
      <Link onClick={openCancelPlanDialogModal} sx={{ mt: '2%', cursor: 'pointer' }}>
        { userProfileLabels['plan.change.cancel'] }
      </Link>
    ) : null;

  return (
    <Layout isLoading={isLoading} gridProps={{ sx: { ...flexColumn, ...styles } }}>
      <InformativeAlert
        {...informativeAlertData}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={cleanInformativeAlertInfo}
      />
      <DialogModal
        {...modalContent}
        cancelText={sharedLabels.cancel}
        acceptText={sharedLabels.accept}
        handleAccept={handlePlanCancel}
        handleDeny={closeDialogModal}
      />
      <StaticAlert
        styles={{
          width: !isLayourNearTabletSize ? '15%' : '80%',
          marginTop: '2%',
        }}
        severity={subscriptionAlertSeverity}
        label={subscriptionAlertLabel}
      />
      {
        actualPlan === PLAN_TYPE_PAID && !!expirationDate && (
          <StaticAlert
            styles={{
              width: !isLayourNearTabletSize ? '15%' : '80%',
              marginTop: '2%',
            }}
            severity="info"
            label={userProfileLabels['plan.subscription.expiresOn'].replace('{expirationDate}', expirationDate)}
          />
        )
      }
      <SelectComponent
        defaultSelected={actualPlan === PLAN_TYPE_FREE ? 0 : 1}
        values={[sharedLabels.plansNames.FREE, sharedLabels.plansNames.PAID]}
        containerStyles={{
          mt: !isLayourNearTabletSize ? '3%' : '10%',
          width: !isLayourNearTabletSize ? '30%' : '100%',
        }}
        handleOnChange={onPlanChange}
        label={userProfileLabels['plan.label']}
        renderValue={(value) => (value === plansNames[actualPlan] ? `${value} (Tu plan actual)` : value)}
        disabled={planRequestChangeExists || hasPendingRequest}
      />
      {
        showPlanDisclaimer && (
          <Disclaimer text={plan === PLAN_TYPE_PAID ? userProfileLabels['plan.change.paid.disclaimer']
            : userProfileLabels['plan.change.free.disclaimer']}
          />
        )
      }
      {
        !hasPendingRequest && (
          <Box
            display="flex"
            flexDirection="column"
            alignSelf="flex-start"
          >
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ mt: '5%', mb: !isLayourNearTabletSize ? 0 : '10%' }}
              disabled={actualPlan === plan}
              onClick={() => planChangeHandlers[plan]()}
            >
              { saveChangesButtonLabel }
            </Button>
          </Box>
        )
      }
      {
        planChangedPending && (
          <>
            <StaticAlert
              severity="success"
              label={userProfileLabels['plan.change.finalMessage']}
              styles={{
                width: !isLayourNearTabletSize ? '25%' : '80%',
                marginTop: '2%',
              }}
            />
            { cancelPlanLink }
          </>
        )
      }
      { getPlanDescription(plan, planesInfo, true, promotionInfo) }
      {
        plan === PLAN_TYPE_FREE && (
          <LocationMap
            enableDragEvents={false}
            circleRadius={1000}
            location={parseLocationForMap(userLocation)}
            containerStyles={{
              height: '600px',
            }}
          />
        )
      }
      {
        isChangingPlan && plan === PLAN_TYPE_PAID && (
          <Box {...flexColumn}>
            <Typography variant="h5">
              { sharedLabels.ourPromotions }
              {' '}
              { ' ' }
              { sharedLabels.termsAndConditionsApply}
              :
            </Typography>
            <Box marginTop="15px" gap="10px">
              { renderPromotionsInfo(promotionsInfo) }
            </Box>
          </Box>
        )
      }
    </Layout>
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
  cancelPlanChange: PropTypes.func.isRequired,
  paySubscription: PropTypes.func.isRequired,
  getSitePromotions: PropTypes.func.isRequired,
  planesInfo: PropTypes.arrayOf(PropTypes.shape(planShape)).isRequired,
  planRequestChangeExists: PropTypes.bool.isRequired,
  actualPlan: PropTypes.oneOf(['FREE', 'PAID']).isRequired,
  suscripcionData: PropTypes.shape(suscriptionShape).isRequired,
};

export default PlanData;
