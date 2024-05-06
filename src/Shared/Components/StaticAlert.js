import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';

/** Alert that shows a message which remains visible until component is unmounted */
function StaticAlert({
  severity, variant, styles, label,
}) {
  return (
    <Alert
      severity={severity}
      variant={variant}
      sx={{ ...styles }}
    >
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </Alert>
  );
}

StaticAlert.defaultProps = {
  severity: 'info',
  variant: 'filled',
  styles: {},
};

StaticAlert.propTypes = {
  severity: PropTypes.string,
  variant: PropTypes.string,
  styles: PropTypes.object,
  label: PropTypes.string.isRequired,
};

export default StaticAlert;
