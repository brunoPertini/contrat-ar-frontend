import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { useContext } from 'react';
import { sharedLabels } from '../../StaticData/Shared';
import { NavigationContext } from '../../State/Contexts/NavigationContext';

/**
 * Renders a link which reads a function from NavigationContext and runs it when clicked.
 * It should be wrapped under NavigationContextProvider
 */
function GoBackLink() {
  const { handleGoBack: goBackFunction, params } = useContext(NavigationContext);
  return (
    <Box sx={{ mt: '1rem', mb: '1rem', width: '30%' }}>
      <Link
        id="goBackLink"
        component="button"
        variant="h5"
        onClick={() => goBackFunction(...params)}
        sx={{ cursor: 'pointer' }}
      >
        { sharedLabels.goBack }
      </Link>
    </Box>
  );
}

export default GoBackLink;
