import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import Box from '@mui/material/Box';
import ExpandableCard from './ExpandableCard';
import { systemConstants } from '../Constants';
import { signUpLabels } from '../../StaticData/SignUp';
import { sharedLabels } from '../../StaticData/Shared';
import { planShape } from '../PropTypes/Proveedor';
import {
  getPlanByType,
  getPlanDescription, getPlanId, getPlanType,
  renderPlanPrice,
  renderPromotionsInfo,
} from '../Helpers/PlanesHelper';
import { PLAN_TYPE_FREE, PLAN_TYPE_PAID } from '../Constants/System';
import LocationMap from './LocationMap';
import { locationShape } from '../PropTypes/Shared';
import Disclaimer from './Disclaimer';
import { flexColumn } from '../Constants/Styles';

const gridStyles = {
  marginTop: '5%',
  marginBottom: '5%',
  flexDirection: 'column',
  alignItems: 'center',
};

const collapsableAreaStyles = {
  justifyContent: 'center',
};

const cardStyles = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

export default function PlanSelection({
  selectedPlan, setSelectedPlan, planesInfo, userLocation,
  getSitePromotions,
}) {
  const [promotionsInfo, setPromotionsInfo] = useState([]);

  const handleSetPromotionsInfo = useCallback(async () => {
    const newPromotionsInfo = await getSitePromotions();
    setPromotionsInfo([...newPromotionsInfo]);
  }, [getSitePromotions]);

  useEffect(() => {
    handleSetPromotionsInfo();
  }, []);

  const shouldRenderPromoInfo = useMemo(() => !!promotionsInfo?.length, [promotionsInfo]);

  const plansColumns = (
    <>
      <Card sx={cardStyles}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {sharedLabels.plansNames.FREE}
          </Typography>
          { renderPlanPrice(getPlanByType(planesInfo, PLAN_TYPE_FREE))}
          <RadioGroup
            value={getPlanType(planesInfo, selectedPlan)}
            onChange={(e) => setSelectedPlan(getPlanId(planesInfo, e.target.value))}
            sx={{ marginTop: '2%' }}
          >
            <FormControlLabel
              value={systemConstants.PLAN_TYPE_FREE}
              control={<Radio />}
              label={sharedLabels.iWantIt}
            />
          </RadioGroup>
        </CardContent>

        <CardContent>
          <Typography variant="subtitle-1">
            { getPlanDescription(PLAN_TYPE_FREE, planesInfo)}
          </Typography>
          <LocationMap
            enableDragEvents={false}
            circleRadius={1500}
            location={userLocation}
            containerStyles={{
              height: '25rem',
              width: '100%',
            }}
          />
        </CardContent>
      </Card>
      <Card sx={cardStyles}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {sharedLabels.plansNames.PAID}
          </Typography>
          { renderPlanPrice(getPlanByType(planesInfo, PLAN_TYPE_PAID))}
          <RadioGroup
            value={getPlanType(planesInfo, selectedPlan)}
            onChange={(e) => setSelectedPlan(getPlanId(planesInfo, e.target.value))}
            sx={{ marginTop: '2%' }}
          >
            <FormControlLabel
              value={systemConstants.PLAN_TYPE_PAID}
              control={<Radio />}
              label={sharedLabels.iWantIt}
            />
          </RadioGroup>
        </CardContent>
        <CardContent>
          { getPlanDescription(PLAN_TYPE_PAID, planesInfo)}
        </CardContent>
        {
          shouldRenderPromoInfo && (
          <CardContent>
            <Typography variant="h5">
              { sharedLabels.ourPromotions }
              {' '}
              { ' ' }
              { sharedLabels.termsAndConditionsApply}
              :
            </Typography>
            <Box {...flexColumn} marginTop="15px" gap="10px">
              { renderPromotionsInfo(promotionsInfo) }
            </Box>
          </CardContent>
          )
        }
      </Card>
    </>
  );

  const cardTitle = <Disclaimer text={signUpLabels['planSelection.paid.disclaimer']} />;

  return (
    <ExpandableCard
      title={cardTitle}
      gridStyles={gridStyles}
      collapsableContent={plansColumns}
      collapsableAreaStyles={collapsableAreaStyles}
      keepCollapsableAreaOpen
    />
  );
}

PlanSelection.propTypes = {
  selectedPlan: PropTypes.number.isRequired,
  setSelectedPlan: PropTypes.func.isRequired,
  getSitePromotions: PropTypes.func.isRequired,
  planesInfo: PropTypes.arrayOf(PropTypes.shape(planShape)).isRequired,
  userLocation: PropTypes.shape(locationShape).isRequired,
};
