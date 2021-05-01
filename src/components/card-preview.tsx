import { Button, Popover } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { createStyles, makeStyles, useTheme } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { renderCard } from './card-rendering/render-card';
import { saveAs } from 'file-saver';
import { FileCopy, Save } from '@material-ui/icons';
import { convertDataURLToBlob } from '@barusu/util-blob';
import { Card } from '../model/types';
import { GlassMagnifier } from 'react-image-magnifiers';
import { Theme } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: 450,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
    controls: {
      marginTop: theme.spacing(2),
      display: 'flex',
      width: '100%',
    },
    copyButton: {
      marginRight: theme.spacing(1),
    },
    button: { flex: 1 },
    previewImgContainer: {},
    previewImg: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  })
);

declare class ClipboardItem {
  constructor(...args: any[]);
}

export interface CardPreviewProps {
  cardData?: Partial<Card>;
}

export const CardPreview: React.FC<CardPreviewProps> = (props) => {
  const classes = useStyles();
  const theme = useTheme();

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
    if (img == null || !props.cardData) return;
    saveAs(img, props.cardData.name + '.png');
  };

  const onCopiedAlertClosed = () => {
    setCopyAlertOpen(false);
  };

  useEffect(() => {
    renderCard(props.cardData).then((value) => setImg(value));
  });

  return (
    <div className={classes.container}>
      {typeof document !== 'undefined' && (
        <div className={classes.previewImgContainer}>
          <GlassMagnifier
            className={classes.previewImg}
            imageSrc={img}
            imageAlt="cardPreview"
            square
            magnifierSize={'60%'}
            magnifierBorderColor="rgba(255, 255, 255, 0.1)"
            allowOverflow
            magnifierBackgroundColor={theme.palette.background.paper}
          />
        </div>
      )}
      <div className={classes.controls}>
        <Button
          className={clsx(classes.button, classes.copyButton)}
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
          className={classes.button}
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
