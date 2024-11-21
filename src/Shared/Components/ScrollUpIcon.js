import Box from '@mui/material/Box';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';

export default function ScrollUpIcon() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      onClick={() => window.scrollTo(0, 0)}
    >
      <ArrowCircleUpRoundedIcon sx={{ fontSize: '3.2rem', mb: '5px' }} />
    </Box>
  );
}
