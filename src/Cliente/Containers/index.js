import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UserAccountOptions from '../../Shared/Components/UserAccountOptions';
import { labels } from '../../StaticData/Cliente';
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';

function ClienteContainer() {
  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo: { name: 'Bruno' } },
  }];

  return (
    <>
      <Header withMenuComponent menuOptions={menuOptions} />
      <Grid
        container
        sx={{
          marginTop: '5%',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid item>
          <Typography variant="h2" color="#1976d2">
            { labels.title }
          </Typography>
        </Grid>
        <Grid
          item
          sx={{ mt: '2%' }}
        >
          <FormControl>
            <FormLabel>
              {' '}
              <Typography variant="h5">
                { labels.lookingFor }
              </Typography>

            </FormLabel>
            <RadioGroup
              defaultValue="producto"
              name="radio-buttons-group"
              row
            >
              <FormControlLabel
                value="producto"
                control={(
                  <Radio sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 50,
                    },
                  }}
                  />
                )}
                label={sharedLabels.product}
              />
              <FormControlLabel
                value="servicio"
                control={(
                  <Radio sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 50,
                    },
                  }}
                  />
                )}
                label={sharedLabels.service}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid
          item
          sx={{
            width: '40%',
            mt: '2%',
          }}
        >
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">{sharedLabels.search}</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type="text"
              endAdornment={(
                <IconButton
                  aria-label="search-input"
                  edge="end"
                >
                  <SearchOutlinedIcon />
                </IconButton>
)}
              label={sharedLabels.search}
            />
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}

export default ClienteContainer;
