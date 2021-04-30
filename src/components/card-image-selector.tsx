import { Button, makeStyles, Modal, Theme } from '@material-ui/core';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { createStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      wrap: 'none',
    },
    chooseButton: {
      margin: 0,
    },
    chooseButtonText: {
      marginRight: theme.spacing(1),
    },
    path: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      paddingLeft: theme.spacing(2),
      borderLeft: `1px solid ${theme.palette.divider}`,
      height: '100%',
      fontStyle: 'italic',
      color: theme.palette.text.disabled,
    },
    input: {
      display: 'none',
    },
    icon: {
      marginLeft: theme.spacing(1),
    },
    cropModal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cropModalContent: {
      position: 'absolute',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
      border: `2px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

export interface FileUploadProps {
  cardImageHeight: number;
  cardImageWidth: number;
  className?: string;
  onComplete: (image: Blob) => void;
}

export interface Dimension {
  width: number;
  height: number;
}

export const CardImageSelector: React.FC<FileUploadProps> = (props) => {
  const [text, setText] = useState('');
  const [resizedImg, setResizedImg] = useState<string>();
  const [modalOpen, setModalOpen] = useState(false);
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    unit: '%',
    width: 50,
    height: 50,
  });
  const [saving, setSaving] = useState(false);
  const [cropDims, setCropDims] = useState<Dimension>();

  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!cropDims) return;
    setCrop({
      unit: '%',
      width: cropDims.width * 100,
      height: cropDims.height * 100,
    });
  }, [cropDims]);

  const onModalClosed = () => {
    setResizedImg(undefined);
    setModalOpen(false);
    inputRef.current!.value = '';
  };

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) throw Error('No file selected.');

    const reader = new FileReader();
    reader.addEventListener('load', async (e) => {
      let result = reader.result as string;
      const { width: originalWidth, height: originalHeight } = await getImgDimensions(result);
      const minSizes = imageMinsizer(originalWidth, originalHeight, props.cardImageWidth, props.cardImageHeight);
      if (minSizes.resized) {
        result = await resizeImage(reader.result as string, minSizes.width, minSizes.height);
        setCropDims({
          width: props.cardImageWidth / minSizes.width,
          height: props.cardImageHeight / minSizes.height,
        });
      } else {
        setCropDims({
          width: props.cardImageWidth / originalWidth,
          height: props.cardImageHeight / originalHeight,
        });
      }
      setResizedImg(result);
      setModalOpen(true);
    });
    const file = e.target.files[0];
    setText(file.name);
    reader.readAsDataURL(file);
  };

  const onSaveButtonClicked = () => {
    const img = new Image();
    img.onload = () => {
      getCroppedImg(img, crop).then((blob) => {
        props.onComplete(blob);
        setSaving(false);
        setModalOpen(false);
        onModalClosed();
        setResizedImg(undefined);
        setCropDims(undefined);
      });
    };
    img.src = resizedImg!;
    setSaving(true);
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <input
        accept="image/*"
        className={classes.input}
        id="image-upload"
        type="file"
        ref={inputRef}
        onChange={(e) => onFileSelected(e)}
      />
      <label htmlFor="image-uplaod">
        <Button
          color="inherit"
          className={classes.chooseButton}
          onClick={() => inputRef.current?.click()}
          startIcon={<CloudUpload className={classes.icon} />}
        >
          <span className={classes.chooseButtonText}>Choose card image...</span>
        </Button>
      </label>
      <div className={classes.path}>
        <span>{text || 'No file chosen...'}</span>
      </div>
      <Modal className={classes.cropModal} open={modalOpen} onClose={() => onModalClosed()}>
        <div className={classes.cropModalContent}>
          <h1> Crop image </h1>
          {resizedImg && cropDims && (
            <ReactCrop
              locked
              ruleOfThirds
              crop={crop}
              src={resizedImg}
              onChange={(_nextCrop, percentCrop) => setCrop(percentCrop)}
            />
          )}
          <Button onClick={() => onSaveButtonClicked()}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </Modal>
    </div>
  );
};

/**
 * @param {HTMLImageElement} image - Image File Object.
 * @param {String} fileName - Name of the returned file in Promise.
 */
function getCroppedImg(image: HTMLImageElement, crop: ReactCrop.Crop): Promise<Blob> {
  if (!crop.width || !crop.height || crop.x == null || crop.y == null) {
    throw Error('Crop is missing a dimension.');
  }

  const x = (crop.x * image.width) / 100;
  const y = (crop.y * image.height) / 100;
  const width = (crop.width * image.width) / 100;
  const height = (crop.height * image.height) / 100;

  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw Error('Could not get context for image canvas');

  ctx.drawImage(image, x * scaleX, y * scaleY, width * scaleX, height * scaleY, 0, 0, width, height);

  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');
  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject('Blob is undefined/null.');
          return;
        }
        resolve(blob);
      },
      'image/jpeg',
      1
    );
  });
}

function getImgDimensions(dataUri: string): Promise<Dimension> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.src = dataUri;
  });
}

function resizeImage(dataUri: string, width: number, height: number) {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
    img.src = dataUri;
  });
}

function imageMinsizer(width: number, height: number, minWidth: number, minHeight: number) {
  const widthTooLow = width < minWidth;
  const heightTooLow = height < minHeight;

  const widthRatio = minWidth / width;
  const heightRatio = minHeight / height;

  if (widthTooLow && widthRatio > heightRatio) {
    return {
      width: width * widthRatio,
      height: height * widthRatio,
      resized: true,
    };
  } else if (heightTooLow && heightRatio > widthRatio) {
    return {
      width: width * heightRatio,
      height: height * heightRatio,
      resized: true,
    };
  }

  return {
    width,
    height,
    resized: false,
  };
}
