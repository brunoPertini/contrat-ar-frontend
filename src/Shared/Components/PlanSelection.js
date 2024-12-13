import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import ExpandableCard from './ExpandableCard';
import { systemConstants } from '../Constants';
import { signUpLabels } from '../../StaticData/SignUp';
import { sharedLabels } from '../../StaticData/Shared';
import { planShape } from '../PropTypes/Proveedor';
import {
  getPlanDescription, getPlanId, getPlanType, getPlanValue,
} from '../Helpers/PlanesHelper';
import { ARGENTINA_LOCALE, PLAN_TYPE_FREE, PLAN_TYPE_PAID } from '../Constants/System';
import LocationMap from './LocationMap';
import { locationShape } from '../PropTypes/Shared';
import { getLocaleCurrencySymbol } from '../Helpers/PricesHelper';
import Disclaimer from './Disclaimer';

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
}) {
  const plansColumns = (
    <>
      <Card sx={cardStyles}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {sharedLabels.plansNames.FREE}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ my: 2 }}>
            { sharedLabels.finalMonthlyPrice.replace(
              '{price}',
              getLocaleCurrencySymbol(ARGENTINA_LOCALE) + getPlanValue(
                planesInfo,
                systemConstants.PLAN_TYPE_FREE,
              ),
            )}
          </Typography>
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
          <Typography variant="h6" color="primary" sx={{ my: 2 }}>
            { sharedLabels.finalMonthlyPrice.replace(
              '{price}',
              getLocaleCurrencySymbol(ARGENTINA_LOCALE) + getPlanValue(
                planesInfo,
                systemConstants.PLAN_TYPE_PAID,
              ),
            )}
          </Typography>
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
  planesInfo: PropTypes.arrayOf(PropTypes.shape(planShape)).isRequired,
  userLocation: PropTypes.shape(locationShape).isRequired,
};
