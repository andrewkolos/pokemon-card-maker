import { Card, SunMoonTrainerCard } from '../../model/types';
import { CardCanvas } from './card-canvas';

function isSunMoonTrainerCard(card: Card): card is SunMoonTrainerCard {
  const asPokemonCard = card as Partial<SunMoonTrainerCard>;
  return (asPokemonCard.trainerType != null && asPokemonCard.prismStar != null);
}

export async function renderCard(cardData?: Card): Promise<string> {
  const canvas = new CardCanvas();
  console.log(cardData);

  if (cardData === undefined){

  } else if (isSunMoonTrainerCard(cardData)){
    // find template
    const trainerType = cardData.trainerType;
    const prismStar = cardData.prismStar;
    const fullArt = cardData.fullArt;

    const template = prismStar ? 'SunMoonTrainers/Prism.png' : (trainerType == 'Stadium' ? 'SunMoonTrainers/Stadium.png' : (fullArt ? `SunMoonTrainers/${trainerType}FA.png` : `SunMoonTrainers/${trainerType}.png`));
    canvas.drawImage(0,0,cardData.image);
    canvas.drawImage(0,0,template);
    canvas.drawText({
      color: 'black',
      text: cardData.effect,
      fontName: 'FuturaStd',
      fontSize: 48,
      x: 17,
      y: 250,
      maxWidth: 300,
      stroke: {
        color: 'white',
        width: 1
      },
    });
    canvas.drawText({
      color: 'black',
      text: cardData.name,
      fontName: 'FuturaStd',
      fontSize: 48,
      x: 0,
      y: 0,
      maxWidth: 300,
      stroke: {
        color: 'white',
        width: 1
      },
    });
  }

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
