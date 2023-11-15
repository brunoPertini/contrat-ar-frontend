import PropTypes from 'prop-types';

export default function ClienteVendibleCard({ imageSection, titleSection, linkSection }) {
  return (
    <>
      { imageSection }
      { titleSection }
      { linkSection }
    </>
  );
}

ClienteVendibleCard.propTypes = {
  imageSection: PropTypes.node.isRequired,
  titleSection: PropTypes.node.isRequired,
  linkSection: PropTypes.node.isRequired,
};
