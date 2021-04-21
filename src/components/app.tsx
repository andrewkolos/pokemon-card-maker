import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import CardPreview from './card-preview';
import Form from './form';

const useStyles = makeStyles({
  formContainer: {
    width: '600px',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  previewContainer: {
    backgroundColor: '#dddddd',
    display: 'flex',
    justifyContent: 'center',
  },
  contentContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    flexDirection: 'row',
    '> div': {
      margin: '30px',
    },
  },
});

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <Container>
      <div className={classes.contentContainer}>
        <div className={classes.formContainer}>
          <Form />
        </div>
        <div className={classes.previewContainer}>
          <CardPreview />
        </div>
      </div>
    </Container>
  );
};

export default App;
