import Link from '@mui/material/Link';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { sharedLabels } from '../../StaticData/Shared';
import { insertElementAfter, isElementBeingShown } from '../Utils/DomUtils';

/**
 * Renders a link under site's header, which runs passed function when clicked
 * @param {{ handleGoBack: Function }}
 */
export function useGoBackLink({ handleGoBack }) {
  let root;
  let linkRoot;

  useEffect(() => {
    const linkComponent = (
      <Link
        id="goBackLink"
        variant="h5"
        sx={{ width: '30%', cursor: 'pointer' }}
        onClick={() => handleGoBack()}
      >
        { sharedLabels.goBack }
      </Link>
    );

    linkRoot = document.createElement('div');
    linkRoot.id = 'goBackLinkWrapper';
    linkRoot.style.marginTop = '1rem';
    linkRoot.style.marginBottom = '1rem';
    linkRoot.style.width = '25%';

    if (!isElementBeingShown('#goBackLinkWrapper')) {
      const rootElement = document.querySelector('#root');

      if (rootElement) {
        const header = document.querySelector('header');

        root = createRoot(linkRoot);
        root.render(linkComponent);

        insertElementAfter(linkRoot, header);
      }
    } else {
      root = createRoot(linkRoot);
      root.render(linkComponent);
    }
  }, [handleGoBack]);
}
