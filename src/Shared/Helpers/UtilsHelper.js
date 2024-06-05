import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemText from '@mui/material/ListItemText';
import { PRODUCT, PRODUCTS, SERVICE } from '../Constants/System';
import CookiesService from '../../Infrastructure/Services/CookiesService';
import { sharedLabels } from '../../StaticData/Shared';
import { routes } from '../Constants';

export const parseVendibleUnit = (vendibleType) => (vendibleType === PRODUCTS
  ? PRODUCT : SERVICE).toLowerCase();

export const waitAndCleanUserTokenCookie = () => {
  setTimeout(() => {
    const cookiesService = new CookiesService();
    cookiesService.remove(CookiesService.COOKIES_NAMES.USER_TOKEN);
  }, 10000);
};

/**
 * @typedef UserMenuConfiguration
 * @property {any} component
 * @property {Object} props
 * @property {Function} onClick
 */

/**
 * Returns all the necessary components, for the app menu. The caller has to pass the ids
 * of the elements it need, as well as the props and click handlers
 * @param {{Object<String, UserMenuConfiguration>}} elementsConfiguration
 * @returns
 */
export const getUserMenuOptions = (elementsConfiguration) => {
  const myProfileOption = 'myProfile' in elementsConfiguration ? {
    id: 'myProfile',
    component: () => (
      <>
        <ListItemIcon>
          <AccountCircleRoundedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{sharedLabels.myProfile}</ListItemText>
      </>
    ),
    props: elementsConfiguration.myProfile.props,
    onClick: () => {
      window.location.href = routes.userProfile;
    },
  } : undefined;

  const logoutOption = 'logout' in elementsConfiguration ? {
    id: 'logout',
    component: () => (
      <>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{sharedLabels.logout}</ListItemText>
      </>
    ),
    onClick: elementsConfiguration.logout.onClick,
  } : undefined;

  const elements = [
    myProfileOption, logoutOption,
  ];

  return elements.filter((e) => e);
};

/**
 *
 * @param {{ coordinates: Array<Number>}} sourceLocation
 */
export const parseLocationForMap = (sourceLocation) => ({
  coords: {
    latitude: sourceLocation.coordinates[0],
    longitude: sourceLocation.coordinates[1],
  },
});
