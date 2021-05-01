import { Card, SunMoonTrainerCard, TrainerType } from '../../model/types';
import { DeepPartial } from '../../util';
import { CardCanvas } from './card-canvas';

function isSunMoonTrainerCard(card: object): card is SunMoonTrainerCard {
  const asPokemonCard = card as Partial<SunMoonTrainerCard>;
  return asPokemonCard.trainerType != null && asPokemonCard.prismStar != null;
}

export async function renderCard(cardData?: DeepPartial<Card>): Promise<string> {
  const canvas = new CardCanvas();
  if (cardData === undefined) {
  } else if (isSunMoonTrainerCard(cardData)) {
    // find template
    const trainerType = cardData.trainerType;
    const prismStar = cardData.prismStar;
    const fullArt = cardData.fullArt;

    const template = prismStar
      ? 'SunMoonTrainers/Prism.png'
      : trainerType === TrainerType.Stadium
        ? 'SunMoonTrainers/Stadium.png'
        : fullArt
          ? `SunMoonTrainers/${trainerType}FA.png`
          : `SunMoonTrainers/${trainerType}.png`;
    if (cardData.image) {
      canvas.drawImage(0, 0, cardData.image);
    }
    canvas.drawImage(0, 0, template);
    canvas.drawText({
      color: 'black',
      wrap: {
        baseline: 'top',
      },
      text: cardData.effect,
      fontName: 'FuturaStd',
      fontSize: 24,
      x: 70,
      y: 600,
      maxWidth: 600,
      stroke: {
        color: 'white',
        width: 1,
      },
    });
    canvas.drawText({
      color: 'black',
      text: cardData.name,
      fontName: 'FuturaStd',
      fontSize: 48,
      x: 40,
      y: 125,
      maxWidth: 800,
      stroke: {
        color: 'white',
        width: 1,
      },
    });
  }

  return await canvas.toDataURL();
}
