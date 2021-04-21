import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  appBar: {
    marginBottom: '10px',
  },
  appBarText: {
    display: 'inline',
    margin: 'auto',
  },
  footer: {
    marginTop: '3rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #dddddd',
    textAlign: 'center',
  },
});

/**
 * The common layout for all pages.
 */
const Layout: React.FC = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.appBarText} variant="h6">
            Pokemon Card Maker
          </Typography>
        </Toolbar>
      </AppBar>

      <Head>
        <title>Pokemon Card Maker</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <main>{props.children}</main>

      <footer className={classes.footer}>Here is the footer.</footer>
    </React.Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
