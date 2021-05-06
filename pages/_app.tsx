import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { createMuiTheme, ThemeProvider, Tooltip } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { AppBar, createStyles, Theme, Toolbar, Typography, makeStyles } from '@material-ui/core';
import { WeatherNight, WhiteBalanceSunny } from 'mdi-material-ui';
import Image from 'next/image';

import './fonts.scss';
import { blue, lightBlue } from '@material-ui/core/colors';
import { FontFamily } from '../src/font-family';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      marginBottom: '10px',
    },
    toolBar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    appBarText: {
      display: 'flex',
      margin: 'auto',
      fontFamily: FontFamily.Futura,
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
    logo: {
      marginRight: theme.spacing(5),
    },
  })
);

const darkModeStorageKey = 'dark_mode';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const [darkMode, setDarkMode] = useState<boolean>(
    (() => {
      const cache = typeof window === 'undefined' ? false : localStorage.getItem(darkModeStorageKey);
      return Boolean(cache) ?? false;
    })()
  );

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: blue[800],
      },
      secondary: {
        main: lightBlue[600],
      },
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
          <div style={{ display: 'none', alignContent: 'center' }}></div>
          <Image src="/icon-white.png" width="32" height="32" />
          <Typography className={classes.appBarText} variant="h6">
            Pokemon Card Maker
          </Typography>
          <Tooltip title={darkMode ? 'Change to light theme' : 'Change to dark theme'}>
            <div
              className={classes.darkModeToggleButton}
              onClick={() => {
                setDarkMode(!darkMode);
                localStorage.setItem(darkModeStorageKey, String(!darkMode));
              }}
            >
              {darkMode ? <WeatherNight /> : <WhiteBalanceSunny />}
            </div>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Head>
        <meta name="theme-color" content={theme.palette.primary.main} />
        <title>Pokemon Card Maker</title>
        <link rel="shortcut iron" type="image/png" href="/icon.png" />
        <link rel="shortcut icon" sizes="192x192" href="/icon.png" />
        <link rel="apple-touch-icon" href="/img/icon.png" />
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
