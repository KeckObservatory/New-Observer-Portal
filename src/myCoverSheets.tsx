import { Paper, Typography, Stack, Box, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, List, ListItem, Link, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import urls from './urls.json';
import type { userInfoApiResponse } from './api';
import { useEffect, useState } from "react";
import { getCurrentSemester, getLastSemesters, getNewestSemester } from "./api";
import { Main } from './theme';
import { getEmployeeLinks } from "./api"; // Make sure this is imported


interface MyCoverSheetsProps  {
  open: boolean;
  user: userInfoApiResponse;
  setSelectedPage?: (page: string) => void;
  setSelectedUrl?: (url: string) => void;
}

type Program = {
  name: string;
  semid: string;
  title?: string;
  type?: string;
}

/**
 * MyCoverSheets displays links to the user's coversheets ,
 * allows filtering by semester, and provides helpful links.
 */
export function MyCoverSheets({ open, user, setSelectedPage, setSelectedUrl }: MyCoverSheetsProps) {
  const obsid = user?.Id;
  //const obsid = 1521; // for testing


  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Semester dropdown state
  const currentSemester = getCurrentSemester();
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);

  // Add state for newest semester
  const [newestSemester, setNewestSemester] = useState<string>("");

  // Check if user is a Keck employee
  const [isKeckEmployee, setIsKeckEmployee] = useState(false);

  useEffect(() => {
    async function checkEmployee() {
      if (user?.Id) {
        const result = await getEmployeeLinks(user.Id);
        setIsKeckEmployee(Array.isArray(result?.links) && result.links.length > 0);
      }
    }
    checkEmployee();
  }, [user?.Id]);

  // Fetch newest semester on mount
  useEffect(() => {
    async function fetchNewest() {
      const sem = await getNewestSemester();
      setNewestSemester(sem);
    }
    fetchNewest();
  }, []);

  // Update semester options when currentSemester or newestSemester changes
  useEffect(() => {
    if (currentSemester) {
      let semesters = [currentSemester, ...getLastSemesters(currentSemester, 15)];
      // If newestSemester is not already in the list, add it to the front
      if (newestSemester && !semesters.includes(newestSemester)) {
        semesters = [newestSemester, ...semesters];
      }
      setSemesterOptions(semesters);
      setSelectedSemester(currentSemester);
    }
  }, [currentSemester, newestSemester]);

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

          {/* Table of coversheets */}
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
                    setSelectedUrl?.(urls.KPF_CC_OBS_BLOCK_SUBMISSION); //TODO NEEDS TO OPEN NEW TAB
                  }}
                >
                  KPF-CC Observing Block Submission
                </Link>
              </ListItem>
              {/* Only show for Keck employees */}
              {isKeckEmployee && currentSemester && (
                <ListItem>
                  <Link
                    component="button"
                    variant="h6"
                    underline="hover"
                    sx={{ cursor: "pointer", fontSize: "1.15rem", fontWeight: 600 }}
                    onClick={() => {
                      setSelectedPage?.("Submit Engineering Request");
                      setSelectedUrl?.(urls.SUB_ENG_REQ + currentSemester);
                    }}
                  >
                    Submit Engineering Request ({currentSemester})
                  </Link>
                </ListItem>
              )}
            </List>
          </Box>
        </Stack>
      </Paper>
    </Main>
  );
}