import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import ExpandableCard from './ExpandableCard';
import { systemConstants } from '../Constants';
import { signUpLabels } from '../../StaticData/SignUp';
import { sharedLabels } from '../../StaticData/Shared';

const gridStyles = {
  marginTop: '5%',
  marginBottom: '5%',
  flexDirection: 'column',
  alignItems: 'center',
};

const collapsableAreaStyles = {
  flexDirection: 'row',
  justifyContent: 'center',
};

export default function PlanSelection({ selectedPlan, setSelectedPlan, paidPlanValue }) {
  const plansColumns = (
    <>
      <Grid item xs={6}>
        <Card>
          <CardHeader title={sharedLabels.plansNames.FREE} />
          <CardHeader title="$0" />
          <CardContent>
            <Typography variant="subtitle-1">
              { signUpLabels['planSelection.free.description']}
            </Typography>
            <RadioGroup
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              sx={{ marginTop: '2%' }}
            >
              <FormControlLabel
                value={systemConstants.PLAN_TYPE_FREE}
                control={<Radio />}
                label={sharedLabels.iWantIt}
              />
            </RadioGroup>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardHeader title={sharedLabels.plansNames.PAID} />
          <CardHeader title={`$${paidPlanValue}`} />
          <CardContent>
            { signUpLabels['planSelection.paid.description'] }
            <RadioGroup
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              sx={{ marginTop: '2%' }}
            >
              <FormControlLabel
                value={systemConstants.PLAN_TYPE_PAID}
                control={<Radio />}
                label={sharedLabels.iWantIt}
              />
            </RadioGroup>
          </CardContent>
        </Card>
      </Grid>
    </>
  );

  return (
    <ExpandableCard
      title={signUpLabels['planSelection.title']}
      gridStyles={gridStyles}
      collapsableContent={plansColumns}
      collapsableAreaStyles={collapsableAreaStyles}
    />
  );
}

PlanSelection.propTypes = {
  selectedPlan: PropTypes.oneOf([systemConstants.PLAN_TYPE_FREE,
    systemConstants.PLAN_TYPE_PAID]).isRequired,
  setSelectedPlan: PropTypes.func.isRequired,
  paidPlanValue: PropTypes.number.isRequired,
};
