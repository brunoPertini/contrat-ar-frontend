import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Header from '../../Header';
import { ExpandableCard, withRouter } from '../../Shared/Components';
import { signUpLabels } from '../../StaticData/SignUp';
import UserSignUp from '../SignUp';
import { routes, systemConstants } from '../../Shared/Constants';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';

/**
 * Business logic component. It holds signup type and starts the flow for registration process.
 */
function SignUpContainer({ router }) {
  const [signupType, setSignupType] = useState();
  const [hasError, setHasError] = useState();

  const dispatchSignUp = (body) => {
    const httpClient = HttpClientFactory.createUserHttpClient();
    return httpClient.crearUsuario(signupType, { proveedorType: signupType }, body).then(() => {
      router.navigate(routes.signin);
    })
      .catch(() => {
        setHasError(true);
      });
  };

  const signupTypeColumns = (
    <>
      <Grid item xs={4}>
        <Card>
          <CardHeader title="Quiero comprar productos y contratar servicios" />
          <CardContent>
            <Typography variant="subtitle-1">
              Descripcion
            </Typography>
            <RadioGroup
              value={signupType}
              onChange={(e) => setSignupType(e.target.value)}
              sx={{ marginTop: '2%' }}
            >
              <FormControlLabel
                value={systemConstants.USER_TYPE_CLIENTE}
                control={<Radio />}
                label=""
              />
            </RadioGroup>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardHeader title="Quiero ofrecer mis servicios como contratista" />
          <CardContent>
            Descripcion
            <RadioGroup
              value={signupType}
              onChange={(e) => setSignupType(e.target.value)}
              sx={{ marginTop: '2%' }}
            >
              <FormControlLabel
                value={systemConstants.USER_TYPE_PROVEEDOR_SERVICES}
                control={<Radio />}
                label=""
              />
            </RadioGroup>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardHeader title="Quiero ofrecer mis productos en el sitio" />
          <CardContent>
            Descripcion
            <RadioGroup
              value={signupType}
              onChange={(e) => setSignupType(e.target.value)}
              sx={{ marginTop: '2%' }}
            >
              <FormControlLabel
                value={systemConstants.USER_TYPE_PROVEEDOR_PRODUCTS}
                control={<Radio />}
                label=""
              />
            </RadioGroup>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
  const innerComponent = !signupType
    ? (
      <ExpandableCard
        title={(
          <Typography variant="h3">
            {signUpLabels['signup.selection.title']}
          </Typography>
        )}
        gridStyles={{
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
        collapsableContent={signupTypeColumns}
        keepCollapsableAreaOpen
      />
    ) : (
      <UserSignUp
        signupType={signupType}
        dispatchSignUp={dispatchSignUp}
        hasError={hasError}
        router={router}
      />
    );

  return (
    <>
      <Header />
      <Grid
        container
        sx={{
          marginTop: '5%',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid item sx={{ width: '100%' }}>
          {innerComponent}
        </Grid>
      </Grid>

    </>
  );
}

export default withRouter(SignUpContainer);

SignUpContainer.propTypes = {
  router: PropTypes.any.isRequired,
};
