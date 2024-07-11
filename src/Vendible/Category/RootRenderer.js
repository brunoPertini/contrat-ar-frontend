import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import CategoryRenderer from './CategoryRenderer';

class RootRenderer extends CategoryRenderer {
  /** @type {Array<CategoryRenderer>} */
  #children;

  constructor({
    rootName,
    rootId,
    onChange,
    isExpanded,
    children,
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
      <ul>
        <li>
          { rootName }
        </li>
      </ul>
    )
      : (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{ rootName }</Typography>
        </AccordionSummary>
      );
    this.#children = children;
  }

  set children(children) {
    this.#children = children;
  }

  /** @returns {Array<AccordionElement>} */
  get children() {
    return this.#children;
  }
}

export default RootRenderer;
