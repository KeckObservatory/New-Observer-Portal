import Paper from '@mui/material/Paper';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { TelescopeSchedApiResponse } from './api';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export function renderTable(
  instruments: (TelescopeSchedApiResponse & { ReadyState?: string })[]
) {
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
            <TableCell>Avalibility</TableCell>
            <TableCell>Ready</TableCell>
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
                <TableCell>{inst.ReadyState || ""}</TableCell> {/* Show real-time state */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function renderKeckI(keckI: (TelescopeSchedApiResponse & { ReadyState?: string })[], formattedDate: string) {
  return (
    <Grid>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Keck I
        </Typography>
        {/* Add this below the title */}
        <Typography variant="caption" sx={{ display: "block", mb: 1, color: "text.secondary" }}>
          Instrument availability for the night of {formattedDate} HST
        </Typography>
        {keckI.length > 0 ? renderTable(keckI) : <div>Loading Keck I...</div>}
    </Grid>
  );
}
