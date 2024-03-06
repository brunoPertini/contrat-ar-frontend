import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { sharedLabels } from '../../StaticData/Shared';
import { insertElementAfter } from '../Utils/DomUtils';

export function useGoBackLink({ handleGoBack = () => {} }) {
  const linkComponent = (
    <Box
      id="goBackLink"
      sx={{ mt: '1rem', mb: '1rem' }}
    >
      <Link
        variant="h5"
        onClick={() => handleGoBack()}
        sx={{ width: '30%', cursor: 'pointer' }}
      >
        { sharedLabels.goBack }
      </Link>
    </Box>
  );

  const linkRoot = document.createElement('div');
  linkRoot.id = 'goBackLink';
  linkRoot.style.marginTop = '1rem';
  linkRoot.style.marginBottom = '1rem';
  linkRoot.style.width = '25%';

  const rootElement = document.querySelector('#root');

  useEffect(() => {
    let root;
    if (rootElement) {
      const header = document.querySelector('header');

      const previousLinkElement = document.querySelector('#goBackLink');

      if (previousLinkElement) {
        previousLinkElement.remove();
      }

      root = createRoot(linkRoot);
      root.render(linkComponent);

      insertElementAfter(linkRoot, header);
    }

    return () => {
      root.unmount();
      linkRoot.remove();
    };
  }, [rootElement]);
}
