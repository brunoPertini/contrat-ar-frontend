import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { indexLabels } from '../../StaticData/Index';

const questionsIndexes = [1, 2, 3, 4];

function FAQSection({ containerStyles }) {
  return (
    <Box className="faqSection" sx={{ margin: '2%', ...containerStyles }}>
      <Typography variant="h4" align="center" gutterBottom>
        { indexLabels.faqTitle }
      </Typography>
      {
        questionsIndexes.map((index) => (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{ indexLabels[`faq.q.${index}`]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <span dangerouslySetInnerHTML={{
                  __html: index !== 2 ? indexLabels[`faq.a.${index}`]
                    : indexLabels[`faq.a.${index}`].replace(
                      '{termsAndConditionsLink}',
                      process.env.REACT_APP_TERMS_AND_CONDITIONS_URL,
                    ),
                }}
                />
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      }

    </Box>
  );
}

FAQSection.defaultProps = {
  containerStyles: {},
};

FAQSection.propTypes = {
  containerStyles: PropTypes.object,
};

export default FAQSection;
