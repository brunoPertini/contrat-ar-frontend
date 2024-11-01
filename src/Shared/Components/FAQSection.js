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
            Contract Ar es una plataforma que facilita la conexión entre clientes y
            vendedores de productos o servicios.
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
            La plataforma ofrece planes gratuitos y pagos, según el alcance de visibilidad y
            los beneficios adicionales que desees aprovechar.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{ indexLabels['faq.q.4']}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Contract Ar aplica una pequeña comisión en cada transacción para
            cubrir los costos de mantenimien
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default FAQSection;
