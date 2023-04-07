import { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
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
  gridStyles, collapsableAreaStyles,
}) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid
      container
      sx={gridStyles}
      spacing={2}
    >
      <Card sx={{
        width: '50%',
      }}
      >
        <CardContent>
          <Typography paragraph>
            { title }
          </Typography>
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
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Grid
            container
            sx={collapsableAreaStyles}
          >
            { collapsableContent }
          </Grid>
        </Collapse>
      </Card>
    </Grid>
  );
}

ExpandableCard.defaultProps = {
  gridStyles: {},
  collapsableAreaStyles: {},
};

ExpandableCard.propTypes = {
  title: PropTypes.string.isRequired,
  collapsableContent: PropTypes.node.isRequired,
  gridStyles: PropTypes.objectOf(PropTypes.string),
  collapsableAreaStyles: PropTypes.objectOf(PropTypes.string),
};
