import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { hpList } from '../hp-list';
import { CardType } from '../model/card-type';
import { Stage } from '../model/stage';
import { Ability } from '../model/types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '10px',
  },
  break: {
    flexBasis: '100%'
  },
  formControl: {
    margin: '10px',
    minWidth: 120,
  },
  flex1: {
    flex: 1,
  }
});

const Form: React.FC = () => {
  const classes = useStyles();

  const [series, setSeries] = React.useState('');
  const [cardType, setCardType] = React.useState('');
  const [stage, setStage] = React.useState('');
  const [prismStar, setPrismStar] = React.useState(false);
  const [gx, setGx] = React.useState('');
  const [pokemonType, setPokemonType] = React.useState('');
  const [name, setName] = React.useState('');
  const [hp, setHp] = React.useState('');
  const [weaknesses, setWeaknesses] = React.useState([] as string[]);
  const [resistances, setResistances] = React.useState([] as string[]);
  const [retreatCost, setRetreatCost] = React.useState('');
  const [ability, setAbility] = React.useState<Partial<Ability>>({});
  const [attacks, setAttacks] = React.useState([] as string[]);
  const [pokedexInfo, setPokedexInfo] = React.useState('');
  const [flavorText, setFlavorText] = React.useState('');
  const [setNumber, setSetNumber] = React.useState('');
  const [rarity, setRarity] = React.useState('');
  const [imagePath, setImagePath] = React.useState('');
  const [hasAbility, setHasAbility] = React.useState(false);

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel id="card-series-select-label">Card Series</InputLabel>
        <Select labelId="card-series-select-label" value={series} onChange={(e) => setSeries(e.target.value as any)}>
          <MenuItem value="sunmoon">Sun/Moon</MenuItem>
          <MenuItem value="diamondpearl">Diamond/Pearl</MenuItem>
          <MenuItem value="swordshield">Sword/Shield</MenuItem>
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel id="card-type-select-label">Card Type</InputLabel>
        <Select labelId="card-type-select-label" value={cardType} onChange={(e) => setCardType(e.target.value as any)}>
          <MenuItem value="pokemon">Pokemon</MenuItem>
          <MenuItem value="trainer">Trainer</MenuItem>
          <MenuItem value="energy">Energy</MenuItem>
        </Select>
      </FormControl>

      {cardType === CardType.Pokemon && (
        <FormControl className={classes.formControl}>
          <InputLabel id="stage-select-label">Stage</InputLabel>
          <Select labelId="stage-select-label" value={stage} onChange={(e) => setStage(e.target.value as any)}>
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="one">One</MenuItem>
            <MenuItem value="two">Two</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Pokemon && stage === Stage.Basic && (
        <FormControlLabel
          control={<Switch checked={prismStar} onChange={(e) => setPrismStar(e.target.checked)} color="primary" />}
          label="Prism Star"
        />
      )}

      {cardType === CardType.Pokemon && (
        <FormControl>
          <InputLabel id="pokemon-type-select-label">Type</InputLabel>
          <Select labelId="pokemon-type-select-label"
          onChange={(e) => setPokemonType(e.target.value as string)}
          value={pokemonType}>
            <MenuItem value="colorless">Colorless</MenuItem>
            <MenuItem value="darkness">Darkness</MenuItem>
            <MenuItem value="dragon">Dragon</MenuItem>
            <MenuItem value="fairy">Fairy</MenuItem>
            <MenuItem value="fire">Fire</MenuItem>
            <MenuItem value="fighting">Fighting</MenuItem>
            <MenuItem value="grass">Grass</MenuItem>
            <MenuItem value="lightning">Lightning</MenuItem>
            <MenuItem value="metal">Metal</MenuItem>
            <MenuItem value="psychic">Psychic</MenuItem>
            <MenuItem value="water">Water</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Pokemon && (
        <FormControl>
          <InputLabel id="pokemon-type-select-label">Resistance</InputLabel>
          <Select labelId="pokemon-type-select-label"
            onChange={(e) => setResistances([e.target.value as string])}
            value={resistances[0]}>
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="colorless">Colorless</MenuItem>
            <MenuItem value="darkness">Darkness</MenuItem>
            <MenuItem value="dragon">Dragon</MenuItem>
            <MenuItem value="fairy">Fairy</MenuItem>
            <MenuItem value="fire">Fire</MenuItem>
            <MenuItem value="fighting">Fighting</MenuItem>
            <MenuItem value="grass">Grass</MenuItem>
            <MenuItem value="lightning">Lightning</MenuItem>
            <MenuItem value="metal">Metal</MenuItem>
            <MenuItem value="psychic">Psychic</MenuItem>
            <MenuItem value="water">Water</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Pokemon && (
        <FormControl>
          <InputLabel id="pokemon-type-select-label">Weakness</InputLabel>
          <Select labelId="pokemon-type-select-label"
          onChange={(e) => setWeaknesses([e.target.value as string])}
          value={weaknesses[0]}>
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="colorless">Colorless</MenuItem>
            <MenuItem value="darkness">Darkness</MenuItem>
            <MenuItem value="dragon">Dragon</MenuItem>
            <MenuItem value="fairy">Fairy</MenuItem>
            <MenuItem value="fire">Fire</MenuItem>
            <MenuItem value="fighting">Fighting</MenuItem>
            <MenuItem value="grass">Grass</MenuItem>
            <MenuItem value="lightning">Lightning</MenuItem>
            <MenuItem value="metal">Metal</MenuItem>
            <MenuItem value="psychic">Psychic</MenuItem>
            <MenuItem value="water">Water</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Pokemon && (
        <FormControl>
          <InputLabel id="retreat-cost-select-label">Retreat Cost</InputLabel>
          <Select labelId="retreat-cost-select-label"
            value={retreatCost}
            onChange={(e) => setRetreatCost(e.target.value as string)}>
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
        <FormControl className={classes.formControl}>
          <Autocomplete
            id="combo-box-demo"
            options={hpList}
            renderInput={(params) => <TextField {...params} label="HP" variant="outlined" />}
            onChange={(_, value) => setHp(value as any)}
            value={hp}
          />
        </FormControl>
      )}

      {cardType === CardType.Pokemon && (
        <FormControl className={classes.formControl}>
          <InputLabel id="gx-select-label">GX</InputLabel>
          <Select labelId="gx-select-label" value={gx} onChange={(e) => setGx(e.target.value as any)}>
            <MenuItem value="gx">GX</MenuItem>
            <MenuItem value="tagteamgx">Tag Team GX</MenuItem>
            <MenuItem value="neither">Neither</MenuItem>
          </Select>
        </FormControl>
      )}

      <div className="break"></div>
      
      {cardType === CardType.Pokemon && (
        <FormControl className={classes.formControl}>
          <InputLabel id="has-ability-select-label">Has ability?</InputLabel>
          <Select value={hasAbility ? 'yes' : 'no'} labelId="has-ability-select-label">
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
          </Select>
        </FormControl>
      )}

      {cardType === CardType.Pokemon && hasAbility && (
        <React.Fragment>
          <TextField className={classes.formControl} label="Ability name" value={ability.name}
          onChange={(e) => setAbility({...ability, name: e.target.value})} />
          <TextField
            className={`${classes.formControl} ${classes.flex1}`}
            id="outlined-multiline-flexible"
            label="Ability text"
            multiline
            rowsMax={2}
            value={ability.text}
            onChange={(e) => setAbility({...ability, text: e.target.value})}
            variant="outlined"
          />
        </React.Fragment>
      )};
    </div>
  );
};

export default Form;
