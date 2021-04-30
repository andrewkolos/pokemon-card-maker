import { AppBar, Box, Tab, Tabs, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles, useTheme } from '@material-ui/styles';
import React from 'react';
import { Attack } from './attack';
import clsx from 'clsx';

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
}

export const Attacks: React.FC<AttacksProps> = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  if (props.pokemonHasAbility && value === 2) {
    setValue(0);
  }
  return (
    <div className={clsx(classes.root, props.className)}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
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
      <TabPanel value={value} index={0}>
        <Attack />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Attack />
      </TabPanel>
      {!props.pokemonHasAbility && (
        <TabPanel value={value} index={2}>
          <Attack />
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
      {value === index && (
        <Box p={1.5}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
