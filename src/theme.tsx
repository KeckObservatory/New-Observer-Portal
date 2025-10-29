import { createTheme } from "@mui/material/styles";
import type { Theme, PaletteMode } from "@mui/material";

export const handleTheme = (darkState: boolean | null | undefined): Theme => {
  const paletteMode = darkState ? "dark" : "light";

  return createTheme({
    palette: {
      mode: paletteMode as PaletteMode,
      // Set palette colors for dark and light mode
      ...(paletteMode === "dark" 
        ? {
            primary: { main: "#90caf9" }, // Light blue for dark mode
            background: {
              default: "#181c24", // Main background in dark mode
              paper: "#232936",   // Paper background in dark mode
            },
          }
        : {
            primary: { main: "#1976d2" }, // Default blue for light mode
            background: {
              default: "#f5f5f5", // Main background in light mode
              paper: "#fff",      // Paper background in light mode
            },
          }),
    },
    components: {
      // TopBar (AppBar) colors
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: paletteMode === "dark" ? "#232936" : "#3b4ba2", // TopBar color for each mode
          },
        },
      },
      // Table row background override for dark mode
      MuiTableRow: {
        styleOverrides: {
          root: {
            // Only apply background color in dark mode
            ...(paletteMode === "dark" && {
              backgroundColor: "#232936",
              "&.Mui-selected, &.Mui-selected:hover": {
                backgroundColor: "#2d3446", // Selected row color in dark mode
              },
            }),
          },
        },
      },
      // Table cell color and border override for dark mode
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: paletteMode === "dark" ? "#e0e0e0" : undefined, // Text color in dark mode
            borderColor: paletteMode === "dark" ? "#333" : undefined, // Border color in dark mode
          },
        },
      },
    },
  });
};