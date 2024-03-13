import PropTypes from 'prop-types';

export default function ProveedorVendibleCard({
  imageSection,
  titleSection,
  linkSection,
}) {
  return (
    <>
      { titleSection }
      { imageSection }
      { linkSection }
    </>
  );
}

ProveedorVendibleCard.propTypes = {
  imageSection: PropTypes.node.isRequired,
  titleSection: PropTypes.node.isRequired,
  linkSection: PropTypes.node.isRequired,
};
