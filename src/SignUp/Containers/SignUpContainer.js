import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
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
import { systemConstants } from '../../Shared/Constants';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { USER_TYPE_CLIENTE } from '../../Shared/Constants/System';

const localStorageService = new LocalStorageService();

/**
 * Business logic component. It holds signup type and starts the flow for registration process.
 */
function SignUpContainer({ router }) {
  const [signupType, setSignupType] = useState();
  const [planesInfo, setPlanesInfo] = useState([]);

  const dispatchSignUp = (body) => {
    const httpClient = HttpClientFactory.createUserHttpClient();
    return httpClient.crearUsuario(signupType, {}, {
      ...body,
      proveedorType: signupType,
    }).then((response) => {
      localStorageService.setItem(LocalStorageService.PAGES_KEYS.ROOT.COMES_FROM_SIGNUP, true);
      localStorageService.setItem(LocalStorageService.PAGES_KEYS.ROOT.SUCCESS, true);
      return response;
    })
      .catch(() => {
        localStorageService.setItem(LocalStorageService.PAGES_KEYS.ROOT.COMES_FROM_SIGNUP, true);
        localStorageService.setItem(LocalStorageService.PAGES_KEYS.ROOT.SUCCESS, false);
      });
  };

  const getAllPlanes = () => {
    const client = HttpClientFactory.createProveedorHttpClient();
    return client.getAllPlanes();
  };

  const fetchPlanesInfo = async () => {
    const fetchedInfo = await getAllPlanes();
    setPlanesInfo(fetchedInfo);
  };

  const handleUploadProfilePhoto = (dni, file) => {
    const client = HttpClientFactory.createProveedorHttpClient();

    return client.uploadTemporalProfilePhoto(dni, file);
  };

  const sendAccountConfirmEmail = (email) => {
    const client = HttpClientFactory.createUserHttpClient();

    return client.sendRegistrationConfirmEmail(email);
  };

  const handleCreateSubscription = (proveedorId, planId, temporalToken) => {
    const client = HttpClientFactory.createProveedorHttpClient({ token: temporalToken });

    return client.createSubscription(proveedorId, planId);
  };

  const signupTypeColumns = (
    <>
      <Grid item xs={4}>
        <Card>
          <CardHeader title={signUpLabels['signup.want.to.client']} />
          <CardContent>
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
          <CardHeader title={signUpLabels['signup.want.to.offer.services']} />
          <CardContent>
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
          <CardHeader title={signUpLabels['signup.want.to.offer.products']} />
          <CardContent>
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
        planesInfo={planesInfo}
        signupType={signupType}
        dispatchSignUp={dispatchSignUp}
        router={router}
        handleUploadProfilePhoto={handleUploadProfilePhoto}
        sendAccountConfirmEmail={sendAccountConfirmEmail}
        createSubscription={handleCreateSubscription}
      />
    );

  useEffect(() => {
    if (signupType !== USER_TYPE_CLIENTE) {
      fetchPlanesInfo();
    }
  }, []);

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
        {innerComponent}
      </Grid>

    </>
  );
}

export default withRouter(SignUpContainer);

SignUpContainer.propTypes = {
  router: PropTypes.any.isRequired,
};
