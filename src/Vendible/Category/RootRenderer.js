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
    children = [],
    renderAsList,
  }) {
    super({
      rootName,
      rootId,
      onChange,
      isExpanded,
      children,
      renderAsList,
    });
    const innerContent = this.renderAsList ? (
      <li>
        { rootName }
        { !!(children.length) && (
        <ul>
          { children.map((c) => {
            const isSubRoot = !!(c.children?.length);
            if (isSubRoot) {
              c.renderAsSubRoot = true;
              return c.render();
            }
            return (
              <li>
                { c.render()}
              </li>
            );
          })}
        </ul>
        )}
      </li>
    ) : null;

    const mainContent = this.renderAsSubRoot ? innerContent : <ul>{innerContent}</ul>;

    this.root = this.renderAsList ? mainContent
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
