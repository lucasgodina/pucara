import { defaultTheme } from 'react-admin'
import { createTheme } from '@mui/material/styles'

// Colores de Pucará Esports
const pucaraColors = {
  primary: '#EA601A',
  primaryDark: '#d55419',
  black: '#000000',
  white: '#ffffff',
  secondaryBlue: '#004B6C',
  secondaryBlueDark: '#003a56',
  secondaryPurple: '#6D237D',
  gray: '#4D4D4D',
  grayLight: '#f8f9fa',
  grayMedium: '#e0e0e0',
  grayDark: '#2a2a2a',
  backgroundDark: '#121212',
  surfaceDark: '#1e1e1e',
  surfaceDarkLight: '#2a2a2a',
}

// Tema claro de Pucará
export const pucaraLightTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'light',
    primary: {
      main: pucaraColors.primary,
      contrastText: pucaraColors.white,
    },
    secondary: {
      main: pucaraColors.secondaryBlue,
      contrastText: pucaraColors.white,
    },
    background: {
      default: pucaraColors.grayLight,
      paper: pucaraColors.white,
    },
    text: {
      primary: pucaraColors.black,
      secondary: pucaraColors.gray,
    },
  },
  typography: {
    fontFamily: '"Ubuntu", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  components: {
    ...defaultTheme.components,
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: pucaraColors.secondaryBlue,
          color: pucaraColors.white,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: pucaraColors.primary,
          color: pucaraColors.white,
        },
      },
    },
  },
})

// Tema oscuro de Pucará
export const pucaraDarkTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: pucaraColors.primary,
      contrastText: pucaraColors.white,
    },
    secondary: {
      main: pucaraColors.secondaryPurple,
      contrastText: pucaraColors.white,
    },
    background: {
      default: pucaraColors.backgroundDark,
      paper: pucaraColors.surfaceDark,
    },
    text: {
      primary: pucaraColors.white,
      secondary: pucaraColors.grayMedium,
    },
  },
  typography: {
    fontFamily: '"Ubuntu", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  components: {
    ...defaultTheme.components,
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: pucaraColors.surfaceDarkLight,
          color: pucaraColors.white,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: pucaraColors.primary,
          color: pucaraColors.white,
        },
      },
    },
  },
})
