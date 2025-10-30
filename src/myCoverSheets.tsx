import { Paper, Typography, Stack, Box, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, List, ListItem, Link, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { styled } from '@mui/material/styles';
import urls from './urls.json';
import type { userInfoApiResponse } from './api';
import { useEffect, useState } from "react";
import { getCurrentSemester, getLastSemesters } from "./api";

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

type Program = {
  name: string;
  semid: string;
  title?: string;
  type?: string;
}

export function MyCoverSheets({ open, user, setSelectedPage, setSelectedUrl }: MyCoverSheetsProps) {
  const obsid = user?.Id || 4718;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Semester dropdown state
  const currentSemester = getCurrentSemester();
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);

  // Update semester options when currentSemester changes
  useEffect(() => {
    if (currentSemester) {
      setSemesterOptions([currentSemester, ...getLastSemesters(currentSemester, 3)]);
      setSelectedSemester(currentSemester);
    }
  }, [currentSemester]);

  // Fetch cover sheets when obsid or selectedSemester changes
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        if (!obsid) {
          setError("No observer ID found");
          setLoading(false);
          return;
        }

        // get all programs for obsid
        const response = await fetch(`${urls.PROPOSALS_API}/getProgramIDs?obsid=${obsid}`);
        if (!response.ok) throw new Error(`${response.status}`);
        const data = await response.json();
        // Filter programs by selected semester
        const programs = (data.programs || []).filter((p: Program) =>
          p.semid && p.semid.includes(selectedSemester)
        );

        // for each program get title/type
        const enrichedPrograms = await Promise.all(
          programs.map(async (program: Program) => {
            try {
              const coverResponse = await fetch(`${urls.PROPOSALS_API}/getCoverSheetInfo?semid=${program.semid}`);
              const coverData = await coverResponse.json();
              if (coverData.success === "SUCCESS" && coverData.result) {
                return {
                  ...program,
                  title: coverData.result.title,
                  type: coverData.result.type
                };
              }
            } catch (err) {
              console.warn(`Failed to fetch cover info for ${program.semid}`, err);
            }
            return program; // fallback
          })
        );

        setData({ ...data, programs: enrichedPrograms });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    if (selectedSemester) fetchData();
  }, [obsid, selectedSemester]);

  return (
    <Main open={open}>
      <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="h6">My Cover Sheets</Typography>
          </Box>

          {/* Semester Dropdown */}
          <Box sx={{ p: 2, pt: 0 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="semester-select-label">Semester</InputLabel>
              <Select
                labelId="semester-select-label"
                value={selectedSemester}
                label="Semester"
                onChange={e => setSelectedSemester(e.target.value)}
              >
                {semesterOptions.map((sem) => (
                  <MenuItem key={sem} value={sem}>{sem}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Table */}
          <Box sx={{ mt: 2 }}>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (data?.programs?.length === 0) ? (
              <Typography>No coversheets for this semester.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 331 }}>
                <Table size="small" stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 160 }}><b>KTN / SemID</b></TableCell>
                      <TableCell sx={{ width: 300 }}><b>Program Title</b></TableCell>
                      <TableCell sx={{ width: 140 }}><b>Type</b></TableCell>
                      <TableCell sx={{ width: 120 }}><b>Action</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {(data?.programs as Program[]).map((program: Program, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{program.semid}</TableCell>
                        <TableCell>{program.title || "—"}</TableCell>
                        <TableCell>{program.type || "—"}</TableCell>
                        <TableCell>
                          <Link
                            href={`${urls.SERVE_COVER_SHEET}ktn=${program.semid}&access=PDF`}
                            target="_blank"
                            rel="noopener"
                            underline="hover"
                            sx={{ fontWeight: 600, cursor: "pointer" }}
                          >
                            View PDF
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* Helpful Links Section */}
          <Box sx={{ p: 2, borderTop: 2, borderColor: "divider" }}>
            <Typography variant="h6">Helpful Links:</Typography>
            <List dense>
              <ListItem>
                <Link
                  component="button"
                  variant="h6"
                  underline="hover"
                  sx={{ cursor: "pointer", fontSize: "1.15rem", fontWeight: 600 }}
                  onClick={() => {
                    setSelectedPage?.("Coversheet Submission");
                    setSelectedUrl?.(urls.COVER_SHEET_SUBMISSION);
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
                    setSelectedPage?.("KPF-CC Observing Block Submission");
                    setSelectedUrl?.(urls.KPF_CC_OBS_BLOCK_SUBMISSION);
                  }}
                >
                  KPF-CC Observing Block Submission
                </Link>
              </ListItem>
            </List>
          </Box>
        </Stack>
      </Paper>
    </Main>
  );
}