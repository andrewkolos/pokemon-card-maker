import { Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import CardRenderer from './card-rendering/card-renderer';
import { saveAs } from 'file-saver';

const useStyles = makeStyles({
  container: {
    width: '400px',
    height: '700px',
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
});

declare class ClipboardItem {
  constructor(...args: any[]);
}

const CardPreview: React.FC = () => {
  const classes = useStyles();

  const [img, setImg] = useState<Blob | undefined>(undefined);
  const [copySnackBarOpen, setCopySnackBarOpen] = useState(false);

  const onCopyToClipBoardButtonClicked = () => {
    const item = new ClipboardItem({ 'image/png': img });
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

  return (
    <div className={classes.container}>
      <div>
        <CardRenderer maxWidth={400} maxHeight={600} cardData={undefined} onChange={(b) => setImg(b)} />
      </div>
      <div>
        <Button
          className={classes.copyButton}
          variant="contained"
          color="primary"
          onClick={() => onCopyToClipBoardButtonClicked()}
        >
          Copy To Clipboard
        </Button>
        <Button
          className={classes.copyButton}
          variant="contained"
          color="primary"
          onClick={() => onSaveButtonClicked()}
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

export default CardPreview;
