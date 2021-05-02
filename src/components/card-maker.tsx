import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { CardPreview } from './card-preview';
import Form from './form';
import { Card } from '../model/types';
import { DeepPartial } from '../util';

const useStyles = makeStyles({
  formContainer: {
    width: '700px',
    overflow: 'hidden',
  },
  previewContainer: {
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

export const CardMaker: React.FC = () => {
  const [cardData, setCardData] = useState<DeepPartial<Card>>();
  const classes = useStyles();

  return (
    <Container>
      <div className={classes.contentContainer}>
        <div className={classes.formContainer}>
          <Form
            onChange={(card) => {
              setCardData(card);
            }}
          />
        </div>
        <div className={classes.previewContainer}>
          <CardPreview cardData={cardData} />
        </div>
      </div>
    </Container>
  );
};
