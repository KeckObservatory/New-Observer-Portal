//import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
//import Grid from '@mui/material/Grid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { telescopeSchedApiResponse } from './api';


export function renderTable(instruments: telescopeSchedApiResponse[]) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 320,
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Instrument</TableCell>
            <TableCell>State</TableCell>
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
                  height: 40, 

                }}
              >
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
