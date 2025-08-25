import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import type { ApiResponse } from './api';

interface TelStatusProps {
  keckI: ApiResponse[];
  keckII: ApiResponse[];
}

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

function renderTable(instruments: ApiResponse[]) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
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

const TelStatus: React.FC<TelStatusProps> = ({ keckI, keckII }) => (
  <Grid container spacing={2} sx={{ height: "85%" }}>
    <Grid size={6} sx={{ height: "100%"}}>
      <Item>
        <h2>Keck I</h2>
        {renderTable(keckI)}
      </Item>
    </Grid>
    <Grid size={6} sx={{ height: "100%"}}>
      <Item>
        <h2>Keck II</h2>
        {renderTable(keckII)}
      </Item>
    </Grid>
  </Grid>
);

export default TelStatus;