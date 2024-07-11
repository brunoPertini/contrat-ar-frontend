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
    this.key = `accordion_${rootName}`;
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

  render() {
    if (this.renderAsList) {
      return (
        <ul>
          {
                this.root
        }
          {
                this.children.map((c) => c.render())
        }
        </ul>
      );
    }

    return (
      <Accordion
        expanded={this.isExpanded}
        onChange={this.onChange()}
        TransitionProps={{ unmountOnExit: true }}
        key={this.key}
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
