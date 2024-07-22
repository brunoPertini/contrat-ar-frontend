import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import { labels } from '../StaticData/LocationMap';
import { sharedLabels } from '../StaticData/Shared';

export const ATTRIBUTES_RENDERERS = {
  text: (attribute) => attribute,
  image: (attribute) => (
    <Link
      sx={{ cursor: 'pointer' }}
      onClick={() => window.open(attribute, '_blank')}
    >
      { attribute }
      ,
    </Link>
  ),
  map: (onLinkClick) => (
    <Link
      sx={{ cursor: 'pointer' }}
      onClick={() => onLinkClick()}
    >
      { labels.openMapInModal }
      ,
    </Link>
  ),
  link: (label, onClick) => (
    <Link
      sx={{ cursor: 'pointer' }}
      onClick={() => onClick()}
    >
      { label }
      ,
    </Link>
  ),
  boolean: (attribute) => (
    <Checkbox
      checked={attribute}
    />
  ),
  enum: (attribute, attributeValue) => {
    const enumAttributes = {
      plan: () => sharedLabels.plansNames[attributeValue],
    };

    return enumAttributes[attribute]();
  },
};
