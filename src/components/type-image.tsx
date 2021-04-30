import { PokemonType } from '../model/types';
import React from 'react';
import Image from 'next/image';

export interface PokemonTypeImageProps {
  type: PokemonType;
  size: number;
}

export const PokemonTypeImage: React.FC<PokemonTypeImageProps> = (props) => {
  return (
    <Image
      src={`/type_symbols/${getTypeImageName(props.type)}`}
      alt={`${props.type} icon.`}
      width={props.size}
      height={props.size}
    />
  );
};

function getTypeImageName(type: PokemonType) {
  if (type === PokemonType.Colorless) return 'colorless_attack_white.png';
  if (type === PokemonType.Dragon) return 'dragon_weakness.png';

  return `${type}_attack.png`;
}
