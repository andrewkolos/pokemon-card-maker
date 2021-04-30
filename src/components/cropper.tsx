import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';

export interface CropperProps {
  imageDataUrl: string;
  cropWidth: number;
  cropHeight: number;
  onComplete: (imageDataUrl: string) => void;
}

export const Cropper: React.FC<CropperProps> = (props) => {
  const [fitToWindowImg, setFitToWindowImg] = useState<string>();
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    unit: 'px',
    width: props.cardImageWidth,
    height: props.cardImageHeight,
  });

  return (

  )
};