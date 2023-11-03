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

  /** @type {JSX.Element} */
  #root;

  /** @type {Function} */
  #onChange;

  /** @type {Boolean} */
  #isExpanded;

  constructor({
    rootName,
    onChange,
    isExpanded,
  }) {
    const onChangeFunction = onChange ?? (() => {});
    this.#root = null;
    this.#onChange = onChangeFunction;
    this.#rootName = rootName;
    this.key = `accordion_${rootName}`;
    this.#isExpanded = isExpanded;
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

  render() {
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
