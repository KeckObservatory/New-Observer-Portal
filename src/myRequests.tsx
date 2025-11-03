import { Paper, Typography, Stack, Box, Table, TableBody, TableCell, TableContainer, TableRow, TableHead} from "@mui/material";
import { Main } from './theme';

// Add setSelectedPage and setSelectedUrl to your props
interface MyRequestsProps  {
  open: boolean;
  setSelectedPage?: (page: string) => void;
  setSelectedUrl?: (url: string) => void;
}

const sampleRows = [
  {
    Date: "2025-10-03",
    Nights: 2,
    TelNr: 1,
    Instrument: "DEIMOS",
    Principle: "Dr. Smith",
    Observers: "A. Johnson, B. Lee",
    ProjCode: "K123",
    RequestID: "001",
    Status: "Pending"
  },
  {
    Date: "2025-10-04",
    Nights: 1,
    TelNr: 2,
    Instrument: "HIRES",
    Principle: "Dr. Chen",
    Observers: "C. Kim",
    ProjCode: "K456",
    RequestID: "002",
    Status: "Approved"
  },
  {
    Date: "2025-10-05",
    Nights: 1,
    TelNr: 1,
    Instrument: "NIRC2",
    Principle: "Dr. Patel",
    Observers: "D. Garcia, E. Brown",
    ProjCode: "K789",
    RequestID: "003",
    Status: "Rejected"
  }
];

export function MyRequests({ open }: MyRequestsProps) {
  return (
    <Main open={open}>
      <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="h6">My Requests</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper} sx={{ maxHeight: 331 }}>
              <Table size="small" stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 120 }}><b>Date</b></TableCell>
                    <TableCell sx={{ width: 120 }}><b># Nights</b></TableCell>
                    <TableCell sx={{ width: 120 }}><b>TelNr</b></TableCell>
                    <TableCell sx={{ width: 120 }}><b>Instrument</b></TableCell>
                    <TableCell sx={{ width: 120 }}><b>Principle</b></TableCell>
                    <TableCell sx={{ width: 120 }}><b>Observers</b></TableCell>
                    <TableCell sx={{ width: 120 }}><b>Proj Code</b></TableCell>
                    <TableCell sx={{ width: 120 }}><b>Request ID</b></TableCell>
                    <TableCell sx={{ width: 100 }}><b>Status</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sampleRows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.Date}</TableCell>
                      <TableCell>{row.Nights}</TableCell>
                      <TableCell>{row.TelNr}</TableCell>
                      <TableCell>{row.Instrument}</TableCell>
                      <TableCell>{row.Principle}</TableCell>
                      <TableCell>{row.Observers}</TableCell>
                      <TableCell>{row.ProjCode}</TableCell>
                      <TableCell>{row.RequestID}</TableCell>
                      <TableCell>{row.Status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Paper>
    </Main>
  );
}