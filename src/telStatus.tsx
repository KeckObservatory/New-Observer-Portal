//import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
//import Grid from '@mui/material/Grid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import type { telescopeSchedApiResponse } from './api';

// interface TelStatusProps {
//   keckI: ApiResponse[];
//   keckII: ApiResponse[];
// }



export function renderTable(instruments: telescopeSchedApiResponse[]) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        //height: 350, // Set your desired fixed height (px, e.g. 300)
        maxHeight: 331, // set max height, so when new items are added it will scroll
        //minHeight: 300,
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Instrument</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Ready</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instruments.map((inst, idx) => {
            const isReady = inst.State === "Scheduled" || inst.State === "TDA Ready";
            return (
              <TableRow
                key={idx}
                sx={{
                  backgroundColor: isReady ? "#95EFA3" : "#f8d7da",
                }}
              >
                <TableCell>{inst.Instrument}</TableCell>
                <TableCell>{inst.State || "Unknown"}</TableCell>
                <TableCell>
                  {isReady ? <CheckIcon sx={{ color: "green" }} /> : <CheckIcon sx={{ color: "red", visibility: "hidden" }} />}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
