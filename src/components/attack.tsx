import {
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Attack as AttackModel, DamageSign, PokemonType } from '../model/types';
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import clsx from 'clsx';
import { HpSelect } from '../hp';
import { GroupLabel } from './group-label';
import Image from 'next/image';
import { enumKeys } from '../enum-keys';
import { PokemonTypeImage } from './type-image';
import { Label } from 'mdi-material-ui';
import { undefIfEmpty } from '../util';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    control: {
      margin: theme.spacing(1),
      minWidth: theme.spacing(12),
    },
    text: {
      width: '100%',
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    costContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: theme.spacing(1),
      justifyContent: 'center',
      marginTop: theme.spacing(3),
    },
    controlSmall: {
      margin: theme.spacing(1),
      width: '16%',
    },
    firstRow: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',
    },
    damageSignSelect: {
      minWidth: 125,
    },
  })
);

export interface AttackProps {
  value?: Partial<AttackModel>;
  onChange: (v: Partial<AttackModel>) => void;
}

type EnergyReqMap = {
  [key in PokemonType]: number;
};

function energyMapToArray(map: EnergyReqMap): PokemonType[] {
  const result: PokemonType[] = [];
  Object.entries(map).forEach((e) => {
    const attacksOfCurrentType: PokemonType[] = Array.from({ length: e[1] }, () => e[0] as PokemonType);
    result.push(...attacksOfCurrentType);
  });
  return result;
}

export const Attack: React.FC<AttackProps> = (props) => {
  const [name, setName] = useState(props.value?.name ?? '');
  const [text, setText] = useState(props.value?.effectText ?? '');
  const [damageSign, setDamageSign] = useState<DamageSign | ''>(props.value?.damageSign ?? '');
  const [damage, setDamage] = useState(props.value?.damage ?? '');
  const [attackCost, setAttackCost] = useState<EnergyReqMap>(
    (() => {
      const result = {} as EnergyReqMap;
      enumKeys(PokemonType).forEach((t) => (result[PokemonType[t]] = 0));

      if (props.value?.cost) {
        props.value.cost.forEach((t) => {
          result[t] = result[t] + 1;
        });
      }

      return result;
    })()
  );

  useEffect(() => {
    props.onChange({
      cost: energyMapToArray(attackCost),
      damage: damage === '' ? undefined : Number(damage),
      damageSign: undefIfEmpty(damageSign),
      effectText: text,
      name,
    });
  }, [name, text, damageSign, damage, attackCost]);

  const classes = useStyles();
  const theme: Theme = useTheme();
  return (
    <div className={clsx(classes.root)}>
      <div className={classes.firstRow}>
        <TextField
          className={classes.control}
          style={{ minWidth: 375 }}
          value={name}
          label="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <HpSelect value={damage} label="Damage" onChange={(v) => setDamage(v)} className={classes.control} />
        <FormControl className={classes.damageSignSelect}>
          <InputLabel id="damage-modifier-select-label">Damage mod</InputLabel>
          <Select
            labelId="damage-modifier-select-label"
            value={damageSign}
            onChange={(e) => setDamageSign(e.target.value as any)}
          >
            <MenuItem value="none" placeholder="None">
              None
            </MenuItem>
            <MenuItem value={DamageSign.Plus}>{DamageSign.Plus}</MenuItem>
            <MenuItem value={DamageSign.Cross}>{DamageSign.Cross}</MenuItem>
            <MenuItem value={DamageSign.Hyphen}>{DamageSign.Hyphen}</MenuItem>
          </Select>
        </FormControl>
        <div style={{ flexBasis: '100%' }}></div>
        <FormControl className={clsx(classes.text, classes.control)}>
          <TextField value={text} multiline label="Text" onChange={(e) => setText(e.target.value)} />
        </FormControl>
      </div>
      <GroupLabel
        label="Energy Requirement"
        className={clsx(classes.control, classes.costContainer)}
        parentBgColor={theme.palette.background.paper}
      >
        {enumKeys(PokemonType)
          .filter((v) => PokemonType[v] !== PokemonType.Dragon)
          .map((type) => (
            <React.Fragment key={type}>
              <TextField
                label={type}
                className={classes.controlSmall}
                type="number"
                defaultValue={0}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PokemonTypeImage type={PokemonType[type]} size={25} />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  setAttackCost({
                    ...attackCost,
                    [type]: Number(e.target.value),
                  });
                }}
              />
            </React.Fragment>
          ))}
      </GroupLabel>
    </div>
  );
};
