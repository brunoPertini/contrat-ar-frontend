import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { indexLabels } from '../../StaticData/Index';

function FAQSection() {
  return (
    <Box sx={{ margin: '2%' }}>
      <Typography variant="h4" align="center" gutterBottom>
        { indexLabels.faqTitle }
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{ indexLabels['faq.q.1']}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            { indexLabels['faq.a.1']}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{ indexLabels['faq.q.2']}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            <span dangerouslySetInnerHTML={{ __html: indexLabels['faq.a.2'] }} />
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{ indexLabels['faq.q.3']}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            { indexLabels['faq.a.3']}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{ indexLabels['faq.q.4']}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            { indexLabels['faq.a.4']}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default FAQSection;
