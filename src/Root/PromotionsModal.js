import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CampaignIcon from '@mui/icons-material/Campaign';
import AnimatedModal from '../Shared/Components/AnimatedModal';
import { flexColumn, flexRow } from '../Shared/Constants/Styles';
import { indexLabels } from '../StaticData/Index';

const renderFooter = (promotions) => (
  <Box {...flexColumn}>

    { promotions.map((promotion, index) => (
      <Typography variant="p">
        {Array(index + 1).fill('*').join('')}
        { promotion.disclaimer }
      </Typography>
    ))}
  </Box>
);

const renderBody = (promotions) => (
  <Box {...flexRow} gap={5}>

    { promotions.map((promotion, index) => (
      <Typography variant="body1">
        <span dangerouslySetInnerHTML={{
          __html: promotion.text,
        }}
        />
        <sup>
          {Array(index + 1).fill('*').join('')}
        </sup>
      </Typography>
    ))}
  </Box>
);

export default function PromotionsModal({ promotions = [], isOpen = false, onClose = () => {} }) {
  const title = (
    <>
      <CampaignIcon />
      { indexLabels['promotions.title'] }
    </>
  );
  return (
    <AnimatedModal
      open={isOpen}
      onClose={onClose}
      title={title}
      footer={renderFooter(promotions)}
    >
      { renderBody(promotions) }
    </AnimatedModal>
  );
}

PromotionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  promotions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
    disclaimer: PropTypes.string,
    discountPercentage: PropTypes.number,
  })).isRequired,
};
