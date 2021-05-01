import { AppBar, Box, Tab, Tabs, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';
import clsx from 'clsx';
import { Attack as AttackComponent } from './attack';
import { Attack } from '../model/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: '98%',
    },
  })
);

export interface AttacksProps {
  className?: string;
  pokemonHasAbility?: boolean;
  onChange?: (value: Attack[]) => void;
}

export const Attacks: React.FC<AttacksProps> = (props) => {
  const classes = useStyles();
  const [tab, setTab] = React.useState(0);
  const [attackOne, setAttackOne] = React.useState<Partial<Attack>>();
  const [attackTwo, setAttackTwo] = React.useState<Partial<Attack>>();
  const [attackThree, setAttackThree] = React.useState<Partial<Attack>>();

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  if (props.pokemonHasAbility && tab === 2) {
    setTab(0);
  }
  return (
    <div className={clsx(classes.root, props.className)}>
      <AppBar position="static" color="default">
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Attack 1" />
          <Tab label="Attack 2" />
          {!props.pokemonHasAbility && <Tab disabled={props.pokemonHasAbility} label="Attack 3" />}
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={0}>
        <AttackComponent value={attackOne} onChange={(v) => setAttackOne(v)} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <AttackComponent value={attackTwo} onChange={(v) => setAttackTwo(v)} />
      </TabPanel>
      {!props.pokemonHasAbility && (
        <TabPanel value={tab} index={2}>
          <AttackComponent value={attackThree} onChange={(v) => setAttackThree(v)} />
        </TabPanel>
      )}
    </div>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box p={1.5}>{children}</Box>}
    </div>
  );
};
