import { CardCanvas } from './card-canvas';

export async function renderCard(cardData: any): Promise<string> {
  const canvas = new CardCanvas();

  canvas.drawImage(0, 0, 'img.png');

  canvas.drawText({
    color: 'black',
    text: 'sample text',
    fontName: 'FuturaStd',
    fontSize: 48,
    x: 17,
    y: 250,
    maxWidth: 300,
    stroke: {
      color: 'white',
      width: 1,
    },
  });

  return await canvas.toDataURL();
}
