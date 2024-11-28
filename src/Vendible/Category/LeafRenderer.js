import AccordionDetails from '@mui/material/AccordionDetails';
import Link from '@mui/material/Link';
import CategoryRenderer from './CategoryRenderer';

class LeafRenderer extends CategoryRenderer {
  constructor({
    rootName,
    rootId,
    onChange,
    isExpanded,
    handleCategorySelected,
    renderAsList,
  }) {
    super({
      rootName,
      rootId,
      onChange,
      isExpanded,
      renderAsList,
    });
    this.root = this.renderAsList ? (
      <li>
        <Link
          variant="caption"
          sx={{
            cursor: 'pointer',
            fontSize: '1rem',
            textDecoration: 0,
          }}
          onClick={() => handleCategorySelected(rootId, rootName)}
        >
          { rootName }
        </Link>
      </li>
    )
      : (
        <AccordionDetails>
          <Link
            onClick={() => handleCategorySelected(rootId, rootName)}
            variant="caption"
            sx={{
              cursor: 'pointer',
              fontSize: '1rem',
              textDecoration: 0,
            }}
          >
            { rootName }
          </Link>
        </AccordionDetails>
      );
  }
}

export default LeafRenderer;
