import { Tooltip, tooltipClasses } from '@mui/material';
import { styled } from '@mui/system';

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
});

export default NoMaxWidthTooltip;
