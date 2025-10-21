import { Paper, Typography, Stack, Box, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, List, ListItem, Link } from "@mui/material";
import { styled } from '@mui/material/styles';
import urls from './urls.json';
import type { userInfoApiResponse } from './api';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: theme.mixins.toolbar.minHeight,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface MyCoverSheetsProps  {
  open: boolean;
  user: userInfoApiResponse | null;
  setSelectedPage?: (page: string) => void;
  setSelectedUrl?: (url: string) => void;
}

const sampleRows = [
  {
    No: 1,
    KTN: "KTN-2025-001",
    Type: "Classical",
    ProgramTitle: "Galactic Center Survey"
  },
  {
    No: 2,
    KTN: "KTN-2025-002",
    Type: "Remote",
    ProgramTitle: "Exoplanet Atmospheres"
  },
  {
    No: 3,
    KTN: "KTN-2025-003",
    Type: "Classical",
    ProgramTitle: "Supernova Follow-up"
  },
  {
    No: 4,
    KTN: "KTN-2025-004",
    Type: "Remote",
    ProgramTitle: "Stellar Populations in M31"
  }
];

export function MyCoverSheets({ open, user, setSelectedPage, setSelectedUrl }: MyCoverSheetsProps) {
    user = user
  return (
    <Main open={open}>
      <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="h6">My Cover Sheets</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper} sx={{ maxHeight: 331 }}>
              <Table size="small" stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 80 }}><b>No.</b></TableCell>
                    <TableCell sx={{ width: 160 }}><b>KTN</b></TableCell>
                    <TableCell sx={{ width: 120 }}><b>Type</b></TableCell>
                    <TableCell sx={{ width: 240 }}><b>Program Title</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sampleRows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.No}</TableCell>
                      <TableCell>{row.KTN}</TableCell>
                      <TableCell>{row.Type}</TableCell>
                      <TableCell>{row.ProgramTitle}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          {/* Helpful Links Section */}
          <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="h6">Helpful Links:</Typography>
            <List dense>
              <ListItem>
                <Link
                  component="button"
                  variant="h6"
                  underline="hover"
                  sx={{ cursor: "pointer", fontSize: "1.15rem", fontWeight: 600 }}
                  onClick={() => {
                    setSelectedPage && setSelectedPage("Coversheet Submission");
                    setSelectedUrl && setSelectedUrl(urls.COVER_SHEET_SUBMISSION);
                  }}
                >
                  Coversheet Submission
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  component="button"
                  variant="h6"
                  underline="hover"
                  sx={{ cursor: "pointer", fontSize: "1.15rem", fontWeight: 600 }}
                  onClick={() => {
                    setSelectedPage && setSelectedPage("KPF-CC Observing Block Submission");
                    setSelectedUrl && setSelectedUrl(urls.KPF_CC_OBS_BLOCK_SUBMISSION);
                  }}
                >
                  KPF-CC Observing Block Submission
                </Link>
              </ListItem>
            </List>
            <Typography>
              Explore "Pre-Observing Support" for more information and links
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Main>
  );
}