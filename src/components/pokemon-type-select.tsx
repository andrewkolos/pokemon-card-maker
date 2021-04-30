import { FormControl, InputLabel, ListItemIcon, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import { enumKeys } from '../enum-keys';
import { PokemonType } from '../model/types';
import { arrayify } from '../arrayify';
import { PokemonTypeImage } from './type-image';
export interface PokemonTypeSelectProps {
  multiple?: boolean;
  exclude?: PokemonType[];
  canPickNone?: boolean;
  value?: PokemonType[];
  onValueChanged?: (values: PokemonType[]) => void;
  className?: string;
  label: string;
}

export const PokemonTypeSelect: React.FC<PokemonTypeSelectProps> = (props) => {
  const [selectedValues, setSelectedValues] = useState<PokemonType[]>(props.value ? props.value : []);
  const excludedValues = new Set(props.exclude);
  return (
    <FormControl className={props.className}>
      <InputLabel id="pokemon-type-select-label">{props.label}</InputLabel>
      <Select
        multiple={props.multiple}
        labelId="pokemon-type-select-label"
        onChange={(e) => {
          const value = e.target.value as PokemonType[];
          setSelectedValues(value);
          if (props.onValueChanged) props.onValueChanged(value);
        }}
        value={selectedValues}
        renderValue={(selected) => {
          const types = arrayify(selected) as PokemonType[];
          return types.map((s) => (
            <React.Fragment>
              <PokemonTypeImage type={s} size={16} />
              {types.length === 1 ? ' ' + capitalize(s) : undefined}
            </React.Fragment>
          ));
        }}
      >
        {enumKeys(PokemonType).map((k) => {
          const type = PokemonType[k];
          if (excludedValues.has(type)) return undefined;
          return (
            <MenuItem key={type} value={type}>
              <ListItemIcon style={{ marginRight: 12, minWidth: 0 }}>
                <PokemonTypeImage type={type} size={20} />
              </ListItemIcon>
              {capitalize(type)}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
