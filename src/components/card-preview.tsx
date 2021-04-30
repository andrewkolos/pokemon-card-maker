import { Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { renderCard } from './card-rendering/render-card';
import { saveAs } from 'file-saver';
import { FileCopy, Save } from '@material-ui/icons';
import { convertDataURLToBlob } from '@barusu/util-blob';

const useStyles = makeStyles({
  container: {
    width: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  copyButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  previewImgContainer: {},
  previewImg: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

declare class ClipboardItem {
  constructor(...args: any[]);
}

export interface CardPreviewProps {
  cardData: any;
}

export const CardPreview: React.FC<CardPreviewProps> = (props) => {
  const classes = useStyles();

  const [img, setImg] = useState<string>('');
  const [copySnackBarOpen, setCopySnackBarOpen] = useState(false);

  const onCopyToClipBoardButtonClicked = () => {
    const blob = convertDataURLToBlob(img);
    const item = new ClipboardItem({ 'image/png': blob });
    (navigator as any).clipboard.write([item]);
    setCopySnackBarOpen(true);
  };

  const onSaveButtonClicked = () => {
    if (img == null) return;
    saveAs(img, 'card.png');
  };

  const onCopySnackBarClosed = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;

    setCopySnackBarOpen(false);
  };

  useEffect(() => {
    setImg(renderCard(props.cardData));
  }, []);

  return (
    <div className={classes.container}>
      {typeof document !== 'undefined' && (
        <div className={classes.previewImgContainer}>
          <img className={classes.previewImg} src={img} />
        </div>
      )}
      <div>
        <Button
          className={classes.copyButton}
          variant="contained"
          color="primary"
          onClick={() => onCopyToClipBoardButtonClicked()}
          startIcon={<FileCopy />}
        >
          Copy To Clipboard
        </Button>
        <Button
          className={classes.copyButton}
          variant="contained"
          color="primary"
          onClick={() => onSaveButtonClicked()}
          startIcon={<Save />}
        >
          Save
        </Button>
      </div>

      <Snackbar
        open={copySnackBarOpen}
        autoHideDuration={3000}
        onClose={onCopySnackBarClosed}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={onCopySnackBarClosed} severity="success">
          Card image copied to clipboard.
        </Alert>
      </Snackbar>
    </div>
  );
};
