/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { getPlanLabel, getPlanDescription } from '../Helpers/PlanesHelper';
import { sharedLabels } from '../../StaticData/Shared';
import { getLocaleCurrencySymbol } from '../Helpers/PricesHelper';
import { ARGENTINA_LOCALE, PLAN_TYPE_FREE } from '../Constants/System';
import { parseLocationForMap } from '../Helpers/UtilsHelper';
import LocationMap from './LocationMap';
import { indexLabels } from '../../StaticData/Index';

function PlansSection({ plans }) {
  return (
    <Box
      sx={{
        py: 5, px: 2, backgroundColor: '#f4f4f9', textAlign: 'center',
      }}
      display="flex"
      flexDirection="column"
    >
      <Typography variant="h4" gutterBottom>
        { indexLabels.plansTitle }
      </Typography>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        gap={4}
        mt={4}
      >
        {plans.map((plan, index) => (
          <Card
            key={index}
            display="flex"
            flexDirection="column"
            sx={{
              height: '100%',
              maxWidth: 345,
              borderRadius: 3,
              flex: '1 1 300px',
              justifyContent: 'space-between',
            }}
          >
            <CardContent
              display="flex"
              flexDirection="column"
              sx={{ flexGrow: 1 }}
            >
              <Typography variant="h5" fontWeight="bold">
                { getPlanLabel(plan.id)}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ my: 2 }}>
                { sharedLabels.finalMonthlyPrice.replace(
                  '{price}',
                  getLocaleCurrencySymbol(ARGENTINA_LOCALE) + plan.value,
                )}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box>
                { getPlanDescription(plan.type, plans, false) }
              </Box>
            </CardContent>
            {
                plan.type === PLAN_TYPE_FREE && (
                  <LocationMap
                    enableDragEvents={false}
                    circleRadius={1000}
                    location={parseLocationForMap({ coordinates: [-34.919056, -57.9503485] })}
                    containerStyles={{
                      height: '160px',
                      width: '100%',
                    }}
                  />
                )
              }
            <Box display="flex" flexDirection="column" alignSelf="flex-end">
              <Button variant="contained" color="primary" fullWidth>
                { plan.type === PLAN_TYPE_FREE ? indexLabels.suscribe : indexLabels.tryForFree }
              </Button>
            </Box>

          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default PlansSection;
