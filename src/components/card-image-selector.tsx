import { Button, makeStyles, Modal, Theme } from '@material-ui/core';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { createStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { resizeImage } from './resize-image';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
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
      overflow: 'scroll',
      justifyContent: 'center',
    },
    cropModalContent: {
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: `2px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    saveButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    saveButton: {
      minWidth: 200,
    },
  })
);

export interface FileUploadProps {
  cardImageHeight: number;
  cardImageWidth: number;
  className?: string;
  onComplete?: (imageDataUrl: string) => void;
  onChange?: (imageDataUrl: string) => void;
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
    aspect: props.cardImageWidth / props.cardImageHeight,
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
      aspect: props.cardImageWidth / props.cardImageHeight,
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
      const result = getCroppedImg(img, crop, {
        width: props.cardImageWidth,
        height: props.cardImageHeight,
      });
      if (props.onComplete) props.onComplete(result);
      setSaving(false);
      setModalOpen(false);
      onModalClosed();
      setResizedImg(undefined);
      setCropDims(undefined);
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
              ruleOfThirds
              crop={crop}
              src={resizedImg}
              keepSelection
              onChange={(_nextCrop, percentCrop) => {
                const resized = cropDims.width * 100 > percentCrop.width!;
                percentCrop.width = Math.max(percentCrop.width!, cropDims.width * 100);
                percentCrop.height = Math.max(percentCrop.height!, cropDims.height * 100);
                if (resized) {
                  // hack
                  percentCrop.x = crop.x;
                  percentCrop.y = crop.y;
                }
                setCrop(percentCrop);
              }}
            />
          )}
          <div className={classes.saveButtonContainer}>
            <Button
              className={classes.saveButton}
              variant="contained"
              color="primary"
              onClick={() => onSaveButtonClicked()}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

/**
 * @param {HTMLImageElement} image - Image File Object.
 * @param {String} fileName - Name of the returned file in Promise.
 */
function getCroppedImg(image: HTMLImageElement, crop: ReactCrop.Crop, outputDims: Dimensions): string {
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

  ctx.drawImage(
    image,
    x * scaleX,
    y * scaleY,
    width * scaleX,
    height * scaleY,
    0,
    0,
    outputDims.width,
    outputDims.height
  );
  return canvas.toDataURL('image/jpeg');
}
//   return new Promise((resolve, reject) => {
//     canvas.toBlob(
//       (blob) => {
//         if (!blob) {
//           reject('Blob is undefined/null.');
//           return;
//         }
//         resolve(blob);
//       },
//       'image/jpeg',
//       1
//     );
//   });
// }

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
function convertImgElToDataUrl(img: HTMLImageElement): string {
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // Set width and height
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw the image
  ctx!.drawImage(img, 0, 0);
  return canvas.toDataURL('image/jpeg');
}
