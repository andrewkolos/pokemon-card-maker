import React from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: `2px solid ${theme.palette.divider}`,
      position: 'relative',
      padding: theme.spacing(1.5, 1, 1, 1),
    },
    label: {
      top: -15,
      left: 10,
      position: 'absolute',
      padding: theme.spacing(0.2),
      color: theme.palette.text.secondary,
    },
  })
);

export interface GroupLabelProps {
  label: string;
  className?: string;
  parentBgColor: string;
}

export const GroupLabel: React.FC<GroupLabelProps> = (props) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      <span className={classes.label} style={{ backgroundColor: props.parentBgColor }}>
        {props.label}
      </span>
      {props.children}
    </div>
  );
};
