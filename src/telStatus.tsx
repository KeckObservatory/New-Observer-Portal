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
            // Special case for NIRSPEC: never show TDA Ready
            const isNirspec = inst.Instrument === "NIRSPEC";
            
            // For NIRSPEC: only "Scheduled" is valid, ignore "TDA Ready"
            const isAvailable = isNirspec 
              ? inst.State === "Scheduled"
              : inst.State === "Scheduled" || inst.State === "TDA Ready";
            
            const isReady = isAvailable && inst.ReadyState === "Ready";

            // Color logic
            let rowColor = theme.palette.mode === "dark" ? "#4d2323" : "#f8d7da"; // red (not available)
            if (isAvailable) {
              rowColor = theme.palette.mode === "dark" ? "#a35c2e" : "#ffcc99"; // orange (scheduled)
            }
            if (isReady) {
              rowColor = theme.palette.mode === "dark" ? "#234d2c" : "#95EFA3"; // green (ready)
            }

            // For NIRSPEC: hide state if it's "TDA Ready", only show if "Scheduled"
            const displayState = isNirspec && inst.State === "TDA Ready" 
              ? "Not Available" 
              : isAvailable 
                ? (inst.State || "Unknown")
                : "Not Available";

            return (
              <TableRow
                key={idx}
                sx={{
                  backgroundColor: rowColor,
                  height: 40,
                }}
              >
                <TableCell>{inst.Instrument}</TableCell>
                <TableCell>{displayState}</TableCell>
                <TableCell>{isAvailable ? (inst.ReadyState || "") : ""}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

