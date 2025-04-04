import Tab from '@mui/material/Tab';
import { userProfileLabels } from '../../StaticData/UserProfile';
import {
  CLIENTE, ROLE_PROVEEDOR_PRODUCTOS,
  ROLE_PROVEEDOR_SERVICIOS,
} from '../../Shared/Constants/System';

export const TABS_NAMES = {
  PERSONAL_DATA: 'PERSONAL_DATA',
  SECURITY: 'SECURITY',
  PLAN: 'PLAN',
  MESSAGES_CLIENT: 'MESSAGES_CLIENT',
  MESSAGES_PROVIDER: 'MESSAGES_PROVIDER',
  MY_PAYMENTS: 'MY_PAYMENTS',
};

export const PERSONAL_DATA_TAB = (
  <Tab
    label={userProfileLabels.personalData}
    value={TABS_NAMES.PERSONAL_DATA}
  />
);

export const MY_PLAN_TAB = <Tab label={userProfileLabels.myPlan} value={TABS_NAMES.PLAN} />;

export const MESSAGES_TAB_CLIENT = (
  <Tab
    label={userProfileLabels.myMessages}
    value={TABS_NAMES.MESSAGES_CLIENT}
  />
);

export const MESSAGES_TAB_PROVIDER = (
  <Tab
    label={userProfileLabels.myMessagesProvider}
    value={TABS_NAMES.MESSAGES_PROVIDER}
  />
);

export const PAYMENTS_TAB = (
  <Tab
    label={userProfileLabels.myPayments}
    value={TABS_NAMES.MY_PAYMENTS}
  />
);

export const SECURITY_TAB = <Tab label={userProfileLabels.security} value={TABS_NAMES.SECURITY} />;

export const rolesTabs = {
  [CLIENTE]: [PERSONAL_DATA_TAB, SECURITY_TAB, MESSAGES_TAB_CLIENT],
  [ROLE_PROVEEDOR_PRODUCTOS]: [PERSONAL_DATA_TAB,
    SECURITY_TAB, MY_PLAN_TAB, PAYMENTS_TAB],
  [ROLE_PROVEEDOR_SERVICIOS]: [PERSONAL_DATA_TAB,
    SECURITY_TAB, MY_PLAN_TAB, PAYMENTS_TAB],
};

export const NEED_APPROVAL_ATTRIBUTES = ['email', 'password'];
