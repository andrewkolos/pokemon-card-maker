import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { WeatherNight, WhiteBalanceSunny } from 'mdi-material-ui';

const useStyles = makeStyles({
  appBar: {
    marginBottom: '10px',
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
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
  darkModeToggleButton: {
    cursor: 'pointer',
  },
});

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
    },
  });

  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <div style={{ display: 'none' }}></div>
          <Typography className={classes.appBarText} variant="h6">
            Pokemon Card Maker
          </Typography>
          <div className={classes.darkModeToggleButton} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <WeatherNight /> : <WhiteBalanceSunny />}
          </div>
        </Toolbar>
      </AppBar>

      <Head>
        <title>Pokemon Card Maker</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <main>
        <Component {...pageProps} />
      </main>

      <footer className={classes.footer}>Here is the footer.</footer>
    </ThemeProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
