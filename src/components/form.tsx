import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { CardType } from '../model/card-type';
import { Stage } from '../model/stage';
import { Ability, Card, PokemonCard, PokemonType } from '../model/types';
import clsx from 'clsx';

import { PokemonTypeSelect } from './pokemon-type-select';
import { HpSelect } from '../hp';
import { Attacks } from './attacks';
import { CardImageSelector } from './card-image-selector';
import { arrayify } from '../arrayify';
import { NoMeetingRoom } from '@material-ui/icons';
import { Series } from '../model/series';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: theme.spacing(1),
    },
    break: {
      flexBasis: '100%',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    flex1: {
      flex: 1,
    },
    abilityRow: {
      minHeight: 60,
    },
    imageSection: {
      display: 'flex',
    }
  })
);

export interface FormProps {
  onChange: (card: Card) => void;
}

const Form: React.FC<FormProps> = (props) => {
  const classes = useStyles();

  const [series, setSeries] = React.useState('');
  const [cardType, setCardType] = React.useState('');
  const [stage, setStage] = React.useState('');
  const [prismStar, setPrismStar] = React.useState(false);
  const [gx, setGx] = React.useState('');
  const [pokemonType, setPokemonTypes] = React.useState<PokemonType>();
  const [name, setName] = React.useState('');
  const [hp, setHp] = React.useState('');
  const [weaknesses, setWeaknesses] = React.useState([] as PokemonType[]);
  const [resistances, setResistances] = React.useState([] as PokemonType[]);
  const [retreatCost, setRetreatCost] = React.useState('');
  const [ability, setAbility] = React.useState<Partial<Ability>>({});
  const [effect, setEffect] = React.useState('');
  const [attacks, setAttacks] = React.useState([] as string[]);
  const [setNumber, setSetNumber] = React.useState('');
  const [rarity, setRarity] = React.useState('');
  const [imagePath, setImagePath] = React.useState('');
  const [hasAbility, setHasAbility] = React.useState(false);
  const [imgDataUrl, setImgDataUrl] = React.useState<string>();
  const [trainerType, setTrainerType] = React.useState('Item');
  const [isFullArt, setIsFullArt] = React.useState(false);
  const [updated, setUpdated] = React.useState(false);

  const broadcast = () => setUpdated(true);
  useEffect(() => {
    if (!updated) return;
    props.onChange({
      series,
      cardType,
      stage,
      prismStar,
      gx,
      pokemonType,
      name,
      hp,
      weaknesses,
      resistances,
      retreatCost,
      ability,
      effect,
      attacks,
      setNumber,
      rarity,
      imagePath,
      hasAbility,
      imgDataUrl,
      image: imgDataUrl,
      trainerType,
      isFullArt
    } as any);
    setUpdated(false);
  }, [updated]);

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel id="card-series-select-label">Card Series</InputLabel>
        <Select labelId="card-series-select-label" value={series} onChange={(e) => {
          setSeries(e.target.value as any);
          broadcast();
        }}>
          <MenuItem value="sunmoon">Sun/Moon</MenuItem>
          <MenuItem value="diamondpearl">Diamond/Pearl</MenuItem>
          <MenuItem value="swordshield">Sword/Shield</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="card-type-select-label">Card Type</InputLabel>
        <Select
          labelId="card-type-select-label"
          value={cardType}
          onChange={(e) => {
            setCardType(e.target.value as any);
            setImagePath('');
            broadcast();
          }}
        >
          <MenuItem value="pokemon">Pokemon</MenuItem>
          <MenuItem value="trainer">Trainer</MenuItem>
          <MenuItem value="energy">Energy</MenuItem>
        </Select>
      </FormControl>

      <TextField className={classes.formControl} label="Name" onBlur={broadcast} onChange={(v) => setName(v.target.value)} value={name} />

      {cardType === CardType.Trainer && (
        <FormControl className={classes.formControl}>
          <InputLabel id="trainertype-select-label">Trainer Type</InputLabel>
          <Select
            labelId="trainertype-select-label"
            value={trainerType}
            onChange={(e) => {
              setTrainerType(e.target.value as any);
              broadcast();
            }}
          >
            <MenuItem value="Item">Item</MenuItem>
            <MenuItem value="Stadium">Stadium</MenuItem>
            <MenuItem value="Supporter">Supporter</MenuItem>
            <MenuItem value="Tool">Tool</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Trainer && trainerType === 'Supporter' && series === Series.SunMoon && (
        <FormControlLabel
          control={<Checkbox checked={prismStar} onChange={(e) => {
            setPrismStar(e.target.checked);
            broadcast();
          }} color="primary" />}
          label="Prism Star"
        />
      )}

      {cardType === CardType.Pokemon && (
        <FormControl className={classes.formControl}>
          <InputLabel id="stage-select-label">Stage</InputLabel>
          <Select labelId="stage-select-label" value={stage} onChange={(e) => { setStage(e.target.value as any); broadcast() }}>
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="one">One</MenuItem>
            <MenuItem value="two">Two</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Pokemon && stage === Stage.Basic && (
        <FormControlLabel
          control={<Checkbox checked={prismStar} onChange={(e) => {
            setPrismStar(e.target.checked);
            broadcast();
          }} color="primary" />}
          label="Prism Star"
        />
      )}
      {cardType === CardType.Pokemon && (
        <PokemonTypeSelect
          className={classes.formControl}
          label="Type"
          value={pokemonType ? arrayify(pokemonType) : []}
          onValueChanged={(v) => { setPokemonTypes(v[0]); broadcast(); }}
        />
      )}
      {cardType === CardType.Pokemon && (
        <PokemonTypeSelect
          multiple
          canPickNone
          className={classes.formControl}
          label="Resistances"
          value={resistances}
          onValueChanged={(v) => { setResistances(v); broadcast(); }}
        />
      )}
      {cardType === CardType.Pokemon && (
        <PokemonTypeSelect
          label="Weaknesses"
          multiple
          className={classes.formControl}
          value={weaknesses}
          onValueChanged={(v) => { setWeaknesses(v); broadcast(); }}
        />
      )}
      {cardType === CardType.Pokemon && (
        <FormControl className={classes.formControl}>
          <InputLabel id="retreat-cost-select-label">Retreat Cost</InputLabel>
          <Select
            labelId="retreat-cost-select-label"
            value={retreatCost}
            onChange={(e) => { setRetreatCost(e.target.value as string); broadcast(); }}
          >
            <MenuItem value="0">None</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </Select>
        </FormControl>
      )}
      {cardType === CardType.Pokemon && (
        <HpSelect label="HP" onChange={(v) => { setHp(v); broadcast(); }} className={classes.formControl} />
      )}
      {cardType === CardType.Pokemon && (
        <FormControl className={classes.formControl}>
          <InputLabel id="gx-select-label">GX</InputLabel>
          <Select labelId="gx-select-label" value={gx} onChange={(e) => { setGx(e.target.value as any); broadcast() }}>
            <MenuItem value="gx">GX</MenuItem>
            <MenuItem value="tagteamgx">Tag Team GX</MenuItem>
            <MenuItem value="neither">Neither</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Pokemon && (
        <React.Fragment>
          <div className={clsx(classes.break)}></div>
          <FormControlLabel
            className={clsx(classes.formControl, classes.abilityRow)}
            control={
              <Checkbox checked={hasAbility} onChange={
                (e) => { setHasAbility(e.target.checked); broadcast(); }} color="primary" />
            }
            label="Has ability"
          />
        </React.Fragment>
      )}
      {cardType === CardType.Pokemon && (
        <React.Fragment>
          <FormControl className={classes.formControl}>
            <TextField
              disabled={!hasAbility}
              label="Ability name"
              value={ability.name}
              onBlur={broadcast}
              onChange={(e) => setAbility({ ...ability, name: e.target.value })}
            />
          </FormControl>
          <TextField
            className={`${classes.formControl} ${classes.flex1}`}
            disabled={!hasAbility}
            id="outlined-multiline-flexible"
            label="Ability text"
            multiline
            value={ability.text}
            onBlur={broadcast}
            onChange={(e) => { setAbility({ ...ability, text: e.target.value }); broadcast(); }}
          />
        </React.Fragment>
      )}

      <div className={classes.break}></div>

      {cardType === CardType.Pokemon && <Attacks className={classes.formControl} pokemonHasAbility={hasAbility} />}

      <div className={classes.break}></div>

      {cardType !== CardType.Pokemon && (
        <TextField
          className={clsx(classes.formControl, classes.flex1)}
          label="Card text"
          value={effect}
          onBlur={broadcast}
          onChange={(e) => setEffect(e.target.value)}
          multiline
          variant="outlined"
        />
      )}

      <div className={classes.break}></div>

      <div className={classes.imageSection}>
        <FormControlLabel
          className={clsx(classes.formControl)}
          control={
            <Checkbox checked={isFullArt} onChange={(e) => setIsFullArt(e.target.checked)} color="primary" />
          }
          label="Full Art"
        />

        <CardImageSelector
          className={classes.formControl}
          cardImageHeight={681}
          cardImageWidth={983}
          onChange={(imageDataUrl) => {
            setImgDataUrl(imageDataUrl);
            broadcast();
          }}
          onComplete={(imageDataUrl) => {
            setImgDataUrl(imageDataUrl);
            broadcast();
          }}
        />
      </div>
    </div>
  );
};

export default Form;
