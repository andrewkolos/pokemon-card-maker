import { Button, Popover } from '@material-ui/core';
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
  const [copyButton, setCopyButton] = useState<HTMLButtonElement>();
  const [copyAlertOpen, setCopyAlertOpen] = useState(false);

  const onCopyToClipBoardButtonClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    const blob = convertDataURLToBlob(img);
    const item = new ClipboardItem({ 'image/png': blob });
    (navigator as any).clipboard.write([item]);
    setCopyAlertOpen(true);
    setCopyButton(e.currentTarget);
  };

  const onSaveButtonClicked = () => {
    if (img == null) return;
    saveAs(img, 'card.png');
  };

  const onCopiedAlertClosed = () => {
    setCopyAlertOpen(false);
  };

  useEffect(() => {
    renderCard(props.cardData).then((value) => setImg(value));
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
          onClick={onCopyToClipBoardButtonClicked}
          startIcon={<FileCopy />}
        >
          Copy To Clipboard
        </Button>
        <Popover
          id="copied-popover"
          open={copyAlertOpen}
          anchorEl={copyButton}
          onClose={onCopiedAlertClosed}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Alert onClose={onCopiedAlertClosed} severity="success">
            Card image copied to clipboard.
          </Alert>
        </Popover>
        <Button
          className={classes.copyButton}
          variant="contained"
          color="primary"
          onClick={onSaveButtonClicked}
          startIcon={<Save />}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
