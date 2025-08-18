import { createTheme, type PaletteMode, type Theme } from '@mui/material/styles';

export const handleTheme = (darkState: boolean | null | undefined): Theme => {
  const palletType = darkState ? "dark" : "light" as PaletteMode
  const themeOptions = {
    palette: {
      mode: palletType,
      primary: {
        main: '#3b4ba2',
        //contrastText: '#e9ca90',
      },
      secondary: {
        main: '#cc94d6',
      },
    }}
  const theme = createTheme(themeOptions)
  return theme
  }