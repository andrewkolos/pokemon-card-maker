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
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { arrayify, DeepPartial, undefIfEmpty } from '../util';
import { HpSelect } from '../hp';
import { CardType } from '../model/card-type';
import { Series } from '../model/series';
import { Stage } from '../model/stage';
import {
  Ability,
  Attack,
  Card,
  EnergyCard,
  GxType,
  PokemonCard,
  PokemonType,
  TrainerCard,
  TrainerType,
} from '../model/types';
import { Attacks } from './attacks';
import { CardImageSelector } from './card-image-selector';
import { PokemonTypeSelect } from './pokemon-type-select';
import { Energy } from '../model/energy';

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
      width: '100%',
    },
  })
);

export interface FormProps {
  onChange: (card: DeepPartial<Card>) => void;
}

const Form: React.FC<FormProps> = (props) => {
  const classes = useStyles();

  const [series, setSeries] = React.useState<Series | ''>('');
  const [cardType, setCardType] = React.useState<CardType | ''>('');
  const [stage, setStage] = React.useState<Stage | ''>('');
  const [prismStar, setPrismStar] = React.useState(false);
  const [gxType, setGxType] = React.useState<GxType | ''>('');
  const [pokemonType, setPokemonType] = React.useState<PokemonType | ''>('');
  const [name, setName] = React.useState('');
  const [hp, setHp] = React.useState<number>();
  const [weakness, setWeakness] = React.useState<PokemonType | ''>('');
  const [resistance, setResistance] = React.useState<PokemonType | ''>('');
  const [retreatCost, setRetreatCost] = React.useState<number | ''>('');
  const [ability, setAbility] = React.useState<Partial<Ability>>({});
  const [effect, setEffect] = React.useState('');
  const [attacks, setAttacks] = React.useState<Attack[]>([]);
  const [setNumber, setSetNumber] = React.useState('');
  const [hasAbility, setHasAbility] = React.useState(false);
  const [imgDataUrl, setImgDataUrl] = React.useState<string>();
  const [trainerType, setTrainerType] = React.useState<TrainerType | ''>('');
  const [isFullArt, setIsFullArt] = React.useState(false);
  const [updated, setUpdated] = React.useState(false);

  const broadcast = () => setUpdated(true);

  useEffect(() => {
    if (!updated) return;

    if (series !== Series.SunMoon || !cardType) return;

    const commonItems: DeepPartial<Card> = {
      series: undefIfEmpty(series),
      name,
      image: imgDataUrl,
      fullArt: isFullArt,
    };

    if (cardType === CardType.Trainer && trainerType) {
      const card: DeepPartial<TrainerCard> = {
        ...commonItems,
        ...{
          cardType,
          effect,
          trainerType,
          prismStar,
        },
      };
      props.onChange(card);
    }

    if (cardType === CardType.Energy) {
      const card: DeepPartial<EnergyCard> = {
        ...commonItems,
        ...{
          cardType: CardType.Energy,
          energyType: undefIfEmpty(pokemonType),
          effect,
        },
      };
      props.onChange(card);
    }

    if (cardType === CardType.Pokemon) {
      const card: DeepPartial<PokemonCard> = {
        ...commonItems,
        ...{
          ability,
          attacks,
          cardType: CardType.Pokemon,
          gxType: undefIfEmpty(gxType),
          hp: hp ? Number(hp) : undefined,
          pokemonType: undefIfEmpty(pokemonType),
          prismStar,
          resistance,
          ultraBeast: false,
          weakness,
          retreatCost: isNaN(Number(retreatCost)) ? undefined : (retreatCost as number),
        },
      };
      props.onChange(card);
    }
    setUpdated(false);
  }, [updated]);

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel id="card-series-select-label">Card Series</InputLabel>
        <Select
          labelId="card-series-select-label"
          value={series}
          onChange={(e) => {
            setSeries(e.target.value as any);
            broadcast();
          }}
        >
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
            setImgDataUrl(undefined);
            broadcast();
          }}
        >
          <MenuItem value={CardType.Pokemon}>Pokemon</MenuItem>
          <MenuItem value={CardType.Trainer}>Trainer</MenuItem>
          <MenuItem value={CardType.Energy}>Energy</MenuItem>
        </Select>
      </FormControl>

      <TextField
        className={classes.formControl}
        label="Name"
        onBlur={broadcast}
        onChange={(v) => setName(v.target.value)}
        value={name}
      />

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
            <MenuItem value={TrainerType.Item}>Item</MenuItem>
            <MenuItem value={TrainerType.Stadium}>Stadium</MenuItem>
            <MenuItem value={TrainerType.Supporter}>Supporter</MenuItem>
            <MenuItem value={TrainerType.Tool}>Tool</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Trainer && trainerType === TrainerType.Supporter && series === Series.SunMoon && (
        <FormControlLabel
          className={classes.formControl}
          control={
            <Checkbox
              checked={prismStar}
              onChange={(e) => {
                setPrismStar(e.target.checked);
                broadcast();
              }}
              color="primary"
            />
          }
          label="Prism Star"
        />
      )}

      {cardType === CardType.Pokemon && (
        <FormControl className={classes.formControl}>
          <InputLabel id="stage-select-label">Stage</InputLabel>
          <Select
            labelId="stage-select-label"
            value={stage}
            onChange={(e) => {
              setStage(e.target.value as any);
              broadcast();
            }}
          >
            <MenuItem value={Stage.Basic}>Basic</MenuItem>
            <MenuItem value={Stage.One}>One</MenuItem>
            <MenuItem value={Stage.Two}>Two</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Pokemon && stage === Stage.Basic && (
        <FormControlLabel
          className={classes.formControl}
          control={
            <Checkbox
              checked={prismStar}
              onChange={(e) => {
                setPrismStar(e.target.checked);
                broadcast();
              }}
              color="primary"
            />
          }
          label="Prism Star"
        />
      )}
      {cardType === CardType.Pokemon && (
        <PokemonTypeSelect
          className={classes.formControl}
          label="Type"
          value={pokemonType ? arrayify(pokemonType) : []}
          onValueChanged={(v) => {
            setPokemonType(v[0]);
            broadcast();
          }}
        />
      )}
      {cardType === CardType.Pokemon && (
        <PokemonTypeSelect
          canPickNone
          className={classes.formControl}
          label="Resistances"
          value={resistance ? [resistance] : undefined}
          onValueChanged={(v) => {
            setResistance(v[0]);
            broadcast();
          }}
        />
      )}
      {cardType === CardType.Pokemon && (
        <PokemonTypeSelect
          canPickNone
          label="Weaknesses"
          className={classes.formControl}
          value={weakness ? [weakness] : []}
          onValueChanged={(v) => {
            setWeakness(v[0]);
            broadcast();
          }}
        />
      )}
      {cardType === CardType.Pokemon && (
        <FormControl className={classes.formControl}>
          <InputLabel id="retreat-cost-select-label">Retreat Cost</InputLabel>
          <Select
            labelId="retreat-cost-select-label"
            value={retreatCost}
            onChange={(e) => {
              setRetreatCost(e.target.value as number);
              broadcast();
            }}
          >
            <MenuItem value={0}>None</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </FormControl>
      )}
      {cardType === CardType.Pokemon && (
        <HpSelect
          label="HP"
          onChange={(v) => {
            setHp(v);
            broadcast();
          }}
          className={classes.formControl}
        />
      )}
      {cardType === CardType.Pokemon && (
        <FormControl className={classes.formControl}>
          <InputLabel id="gx-select-label">GX</InputLabel>
          <Select
            labelId="gx-select-label"
            value={gxType}
            onChange={(e) => {
              setGxType(e.target.value as any);
              broadcast();
            }}
          >
            <MenuItem value={''}>Neither</MenuItem>
            <MenuItem value={GxType.Gx}>GX</MenuItem>
            <MenuItem value={GxType.TagTeam}>Tag Team GX</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Pokemon && (
        <React.Fragment>
          <div className={clsx(classes.break)}></div>
          <FormControlLabel
            className={clsx(classes.formControl, classes.abilityRow)}
            control={
              <Checkbox
                checked={hasAbility}
                onChange={(e) => {
                  setHasAbility(e.target.checked);
                  broadcast();
                }}
                color="primary"
              />
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
            onChange={(e) => {
              setAbility({ ...ability, text: e.target.value });
              broadcast();
            }}
          />
        </React.Fragment>
      )}

      <div className={classes.break}></div>

      {cardType === CardType.Pokemon && (
        <Attacks
          onChange={(a) => {
            setAttacks(a);
            broadcast();
          }}
          className={classes.formControl}
          pokemonHasAbility={hasAbility}
        />
      )}

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
        <CardImageSelector
          className={clsx(classes.formControl, classes.flex1)}
          cardImageHeight={1038}
          cardImageWidth={747}
          onChange={(imageDataUrl) => {
            setImgDataUrl(imageDataUrl);
            broadcast();
          }}
          onComplete={(imageDataUrl) => {
            setImgDataUrl(imageDataUrl);
            broadcast();
          }}
        />

        <FormControlLabel
          className={clsx(classes.formControl)}
          control={<Checkbox checked={isFullArt} onChange={(e) => setIsFullArt(e.target.checked)} color="primary" />}
          label="Full Art"
        />
      </div>
    </div>
  );
};

export default Form;
