import { makeStyles } from '@material-ui/styles';
import React from 'react';

const useStyles = makeStyles({
  container: {
    width: '300px',
    height: '500px',
    backgroundColor: '#eeeeee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const CardPreview: React.FC = () => {
  const classes = useStyles();

  return <div className={classes.container}>Card Preview</div>;
};

export default CardPreview;
