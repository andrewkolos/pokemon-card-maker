import { createStyles, FormControl, TextField, Theme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { hpList } from './hp-list';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
    },
  })
);

export interface HpSelectProps {
  className?: string;
  onChange?: (value: string) => void;
  label: string;
  value?: number | string;
}

export const HpSelect: React.FC<HpSelectProps> = (props) => {
  const [value, setValue] = useState(props.value ? String(props.value) : '');
  const classes = useStyles();

  return (
    <FormControl className={clsx(classes.root, props.className)}>
      <Autocomplete
        id="combo-box-demo"
        options={hpList}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            onBlur={(e) => {
              const value = hpList.find((v) => v.startsWith(String(e.target.value)));
              if (value) setValue(value);
              if (value && props.onChange) props.onChange(value);
            }}
          />
        )}
        onChange={(_, value) => setValue(value as any)}
        value={value}
      />
    </FormControl>
  );
};
