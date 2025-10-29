//import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
//import Grid from '@mui/material/Grid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { TelescopeSchedApiResponse } from './api';
import { useTheme } from '@mui/material/styles';

export function renderTable(instruments: TelescopeSchedApiResponse[]) {
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 317, // allows scrolling if many rows
      }}
    >
      <Table size="small" stickyHeader>
        {/* --- Header --- */}
        <TableHead>
          <TableRow>
            <TableCell>Instrument</TableCell>
            <TableCell>State</TableCell>
          </TableRow>
        </TableHead>

        {/* --- Body --- */}
        <TableBody>
          {instruments.map((inst, idx) => {
            // "isReady" controls the row color
            const isReady = inst.State === "Scheduled" || inst.State === "TDA Ready";

            const readyColor = isReady
              ? (theme.palette.mode === "dark" ? "#234d2c" : "#95EFA3")
              : (theme.palette.mode === "dark" ? "#4d2323" : "#f8d7da");

            return (
              <TableRow
                key={idx}
                sx={{
                  backgroundColor: readyColor, // green if ready, red/pink if not
                  height: 40,
                }}
              >
                {/* Show the instrument name and state */}
                <TableCell>{inst.Instrument}</TableCell>
                <TableCell>{inst.State || "Unknown"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
