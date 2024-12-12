import { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

const ExpandMore = styled((props) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ExpandableCard({
  title, collapsableContent,
  boxStyles, collapsableAreaStyles,
  keepCollapsableAreaOpen,
}) {
  const [expanded, setExpanded] = useState(keepCollapsableAreaOpen);

  const handleExpandClick = () => {
    if (!keepCollapsableAreaOpen) {
      setExpanded(!expanded);
    }
  };

  const lessThanTabletSize = useMediaQuery('(max-width: 768px)');

  const flexStyles = { display: 'flex', flexDirection: 'column' };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{
        ...boxStyles,
      }}
    >
      <Card sx={flexStyles}>
        <CardContent>
          {title}
        </CardContent>
        <CardActions>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse sx={{ ...flexStyles }} in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: lessThanTabletSize ? 'column' : 'row',
              gap: 2,
              padding: 2,
              ...collapsableAreaStyles,
            }}
          >
            {collapsableContent}
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
}

ExpandableCard.defaultProps = {
  boxStyles: {},
  collapsableAreaStyles: {},
  keepCollapsableAreaOpen: false,
};

ExpandableCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  collapsableContent: PropTypes.node.isRequired,
  boxStyles: PropTypes.object,
  collapsableAreaStyles: PropTypes.object,
  keepCollapsableAreaOpen: PropTypes.bool,
};
