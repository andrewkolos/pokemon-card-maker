export enum CardType {
  Trainer = 'trainer',
  Pokemon = 'pokemon',
  Energy = 'energy',
}

enum Series {
    SunMoon = "Sun & Moon",
    SwordShield = "Sword & Shield"
}

type Card = CardBase & (PokemonCard | TrainerCard | EnergyCard);

interface CardBase = {
  // could also be declared as `interface` instead of `type` but there arent any differences that you would actually care about
  name: string;
  image: string;
  // ...anything else that *all* cards have goes here
};

enum PokemonType {
    Fairy = "Fairy", // only XY and SunMoon
    Colorless = "Colorless",
    Lightning = "Lightning",
    Dragon = "Dragon",
    Metal = "Metal",
    Fire = "Fire",
    Water = "Water",
    Grass = "Grass",
    Psychic = "Psychic",
    Darkness = "Darkness",
    Fighting = "Fighting"
}

interface Attack {
    damage?: number;
    effectText?: string;
    damageSign?: string;
    name: string;
    cost: PokemonType[];
}

interface PokemonCardBase extends CardBase {
  cardType: CardType.Pokemon; // This is the discriminator.
  pokemonType: PokemonType
  hp: number;
  weakness: string;
  resistance: string;
  retreatcost: number;
  ability?: string;
  attacks: Attack[];
  series: Series; // this is some enum (we already have it)
  // anything that all pokemon cards have
}

export interface SunMoonPokemonCard extends PokemonCardBase {
  series: Series.SunMoon;
  gx: boolean; //
  tagteamgx: boolean;
  prismStar: boolean;
  ultraBeast: boolean;
  // anything specific to sun/moon cards
}

interface SwordShieldPokemonCard {

}

export type PokemonCard = SunMoonPokemonCard | SwordShieldPokemonCard;


interface TrainerCard {
    effect: string;
    cardType: CardType.Trainer
    trainerType: "Item" | "Tool" | "Stadium" | "Supporter";

}

export interface SunMoonTrainerCard extends TrainerCard {
    prismStar: boolean;

}

interface EnergyCard {
    cardType: CardType.Energy
    energyType: PokemonType
    effect: string;
}

export interface SunMoonEnergyCard extends EnergyCard{
    prismStar: boolean
}
// etc... go as many levels deep as possible
