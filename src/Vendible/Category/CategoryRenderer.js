import Accordion from '@mui/material/Accordion';
/**
 * Abstract class to render any category element. It (and its extended classes)
 * have the main goal of encapsulating the way the categories are rendered.
 * Any presentational component may be finally used, all it takes is to modify the hierarchy
 * this class models.
 */
class CategoryRenderer {
  /** @type {String} */
  #rootName;

  /** @type {Number} */
  #rootId;

  /** @type {JSX.Element} */
  #root;

  /** @type {Function} */
  #onChange;

  /** @type {Boolean} */
  #isExpanded;

  /** @type {Boolean} */
  #renderAsList;

  /** @type {Boolean} */
  #renderAsSubRoot;

  constructor({
    rootId,
    rootName,
    onChange,
    isExpanded,
    renderAsList = false,
  }) {
    const onChangeFunction = onChange ?? (() => {});
    this.#root = null;
    this.#onChange = onChangeFunction;
    this.#rootName = rootName;
    this.key = `accordion_${rootId}`;
    this.#isExpanded = isExpanded;
    this.#rootId = rootId;
    this.#renderAsList = renderAsList;
  }

  set root(value) {
    this.#root = value;
  }

  get root() {
    return this.#root;
  }

  get rootName() {
    return this.#rootName;
  }

  set isExpanded(value) {
    this.#isExpanded = value;
  }

  get isExpanded() {
    return this.#isExpanded;
  }

  get onChange() {
    return this.#onChange;
  }

  get children() {
    return [];
  }

  set rootId(value) {
    this.#rootId = value;
  }

  get rootId() {
    return this.#rootId;
  }

  get renderAsList() {
    return this.#renderAsList;
  }

  set renderAsSubRoot(value) {
    this.#renderAsSubRoot = value;
    if (value) {
      this.root = (
        <li>
          { this.#rootName }
          { !!(this.children.length) && (
          <ul>
            { this.children.map((c) => {
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
      );
    }
  }

  get renderAsSubRoot() {
    return this.#renderAsSubRoot;
  }

  render() {
    if (this.renderAsList) {
      return this.root;
    }

    return (
      <Accordion
        expanded={this.isExpanded}
        onChange={this.onChange()}
        TransitionProps={{ unmountOnExit: true }}
        key={this.key}
        sx={{
          border: '1px solid #ddd',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px !important',
          '&:before': { display: 'none' },
          bgcolor: '#f9f9f9',
        }}
      >
        {
                this.root
        }
        {
                this.children.map((c) => c.render())
        }
      </Accordion>
    );
  }
}

export default CategoryRenderer;
