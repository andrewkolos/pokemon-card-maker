export enum CardType {
  Trainer = 'trainer',
  Pokemon = 'pokemon',
  Energy = 'energy',
}

enum Series {
  SunMoon = "Sun & Moon",
  SwordShield = "Sword & Shield"
}

export type Card = PokemonCard | TrainerCardBase | EnergyCard;

interface CardBase {
  name: string;
  image: string;
  fullArt: boolean;
  // ...anything else that *all* cards have goes here
};

export enum PokemonType {
  Colorless = "colorless",
  Darkness = "darkness",
  Dragon = "dragon",
  Fairy = "fairy", // only XY and SunMoon
  Fighting = "fighting",
  Fire = "fire",
  Grass = "grass",
  Lightning = "lightning",
  Metal = "metal",
  Psychic = "psychic",
  Water = "water",
}

export enum DamageSign {
  Plus = '+',
  Hyphen = '-',
  Cross = 'x',
}

export enum GxType {
  Gx = 'gx',
  TagTeam = 'tag_team',
}

export interface Attack {
  damage?: number;
  effectText?: string;
  damageSign?: DamageSign;
  name: string;
  cost: PokemonType[];
}

export interface Ability {
  name: string;
  text: string;
}

interface PokemonCardBase extends CardBase {
  cardType: CardType.Pokemon; // This is the discriminator.
  series: Series;
  pokemonType: PokemonType
  hp: number;
  weakness: string;
  resistance: string;
  retreatCost: number;
  ability?: Ability;
  attacks: Attack[];
  // anything that all pokemon cards have
}

export interface SunMoonPokemonCard extends PokemonCardBase {
  series: Series.SunMoon;
  gxType?: GxType;
  prismStar: boolean;
  ultraBeast: boolean;
  // anything specific to sun/moon cards
}

interface SwordShieldPokemonCard extends PokemonCardBase {

}

export type PokemonCard = SunMoonPokemonCard | SwordShieldPokemonCard;

export enum TrainerType {
  Item = 'item',
  Tool = 'tool',
  Stadium = 'stadium',
  Supporter = 'supporter',
}

export type TrainerCard = SunMoonTrainerCard; // Union new trainer cards as needed
interface TrainerCardBase extends CardBase {
  cardType: CardType.Trainer;
  effect: string;
  trainerType: TrainerType;
}

export interface SunMoonTrainerCard extends TrainerCardBase {
  prismStar: boolean;
}

export interface EnergyCard extends CardBase {
  cardType: CardType.Energy;
  energyType: PokemonType;
  effect: string;
}

export interface SunMoonEnergyCard extends EnergyCard {
  prismStar: boolean
}
// etc... go as many levels deep as possible
