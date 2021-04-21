import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { hpList } from '../hp-list';
import { CardType } from '../model/card-type';
import { Stage } from '../model/stage';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '10px',
  },
  formControl: {
    margin: '10px',
    minWidth: 120,
  },
});

const Form: React.FC = () => {
  const classes = useStyles();

  const [series, setSeries] = React.useState('');
  const [cardType, setCardType] = React.useState('');
  const [stage, setStage] = React.useState('');
  const [prismStar, setPrismStar] = React.useState(false);
  const [gx, setGx] = React.useState('');
  const [type, setType] = React.useState('');
  const [name, setName] = React.useState('');
  const [hp, setHp] = React.useState('');
  const [weaknesses, setWeaknesses] = React.useState([] as string[]);
  const [resistances, setResistances] = React.useState([] as string[]);
  const [retreatCost, setRetreatCost] = React.useState('');
  const [abilities, setAbilities] = React.useState([] as string[]);
  const [attacks, setAttacks] = React.useState([] as string[]);
  const [pokedexInfo, setPokedexInfo] = React.useState('');
  const [flavorText, setFlavorText] = React.useState('');
  const [setNumber, setSetNumber] = React.useState('');
  const [rarity, setRarity] = React.useState('');
  const [imagePath, setImagePath] = React.useState('');

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
        <FormControl className={classes.formControl}>
          <Autocomplete
            id="combo-box-demo"
            options={hpList}
            renderInput={(params) => <TextField {...params} label="HP" variant="outlined" />}
            onChange={(_, value) => setHp(value as any)}
          />
        </FormControl>
      )}

      {cardType === CardType.Pokemon && (
        <FormControl className={classes.formControl}>
          <TextField label="HP" type="number" onChange={(e) => setHp(e.target.value)}></TextField>
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
    </div>
  );
};

export default Form;
