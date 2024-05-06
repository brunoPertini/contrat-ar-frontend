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
 * Returns all the necessary components, for the app menu. They can be overwritten,
 * and their props or click handlers too.
 * @param {Array<UserMenuConfiguration>} elementsConfiguration
 * @returns
 */
export const getUserMenuOptions = (elementsConfiguration) => [{
  component: () => (
    <>
      <ListItemIcon>
        <AccountCircleRoundedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{sharedLabels.myProfile}</ListItemText>
    </>
  ),
  props: elementsConfiguration[0].props,
  onClick: () => {
    window.location.href = routes.userProfile;
  },
},
{
  component: () => (
    <>
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{sharedLabels.logout}</ListItemText>
    </>
  ),
  onClick: elementsConfiguration[1].onClick,
}];

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
