import Paper from '@mui/material/Paper';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { TelescopeSchedApiResponse } from './api';
import { useTheme } from '@mui/material/styles';

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
            <TableCell>State</TableCell>
          </TableRow>
        </TableHead>

        {/* --- Body --- */}
        <TableBody>
          {instruments.map((inst, idx) => {
            const isAvaiable = inst.State === "Scheduled" || inst.State === "TDA Ready";
            const isReady = isAvaiable && inst.ReadyState === "Ready";

            // Orange for "Scheduled"/"TDA Ready", green for "Ready", red for not ready
            let rowColor = theme.palette.mode === "dark" ? "#4d2323" : "#f8d7da"; // default: not ready (red)
            if (isAvaiable) {
              rowColor = theme.palette.mode === "dark" ? "#a35c2e" : "#ffcc99"; // orange
            }
            if (isReady) {
              rowColor = theme.palette.mode === "dark" ? "#234d2c" : "#95EFA3"; // green
            }

            return (
              <TableRow
                key={idx}
                sx={{
                  backgroundColor: rowColor,
                  height: 40,
                }}
              >
                <TableCell>{inst.Instrument}</TableCell>
                <TableCell>{inst.State || "Unknown"}</TableCell>
                <TableCell>{inst.ReadyState || ""}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

