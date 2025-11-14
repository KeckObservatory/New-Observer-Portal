import { Paper, Box, Button, Stack } from "@mui/material";
import type { userInfoApiResponse } from "./api";
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { styled } from "@mui/material/styles";
import { Typography, List, ListItem, ListItemText} from "@mui/material";
import { useCombinedSchedule } from "./api";
import urls from './urls.json';
import { useState } from "react";
import { Collapse, IconButton } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { handleUrlClick } from './urlLogic';

type ChecklistItem = {
  text: string;
  url?: string;
  newtab?: boolean; // <-- make sure this matches urlLogic
};

interface ObserverInfoProps {
  user: userInfoApiResponse;      
  setSelectedPage?: (page: string) => void;
  setSelectedUrl?: (url: string | null) => void; 
}

/**
 * Displays a table of user information.
 */
export default function UserTable({ user, setSelectedPage, setSelectedUrl }: ObserverInfoProps) {
  const fullName = [user.FirstName, user.MiddleName, user.LastName]
    .filter(Boolean)
    .join(" ");

  const fullAddress = [user.Street, user.City, user.State, user.Zip, user.Country]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <TableContainer component={Paper}
        sx={{
          //maxHeight: 600,
        }}
      >
        <Table size="small" stickyHeader></Table>
        <Table size="medium">
          <TableBody>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell>{fullName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Email</b></TableCell>
              <TableCell>{user.Email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Affiliation</b></TableCell>
              <TableCell>{user.Affiliation}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Work Area</b></TableCell>
              <TableCell>{user.WorkArea}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Interests</b></TableCell>
              <TableCell>{user.Interests}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Address</b></TableCell>
              <TableCell>{fullAddress}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Phone</b></TableCell>
              <TableCell>{user.Phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>URL</b></TableCell>
              <TableCell>
                <a href={user.URL} target="_blank" rel="noopener noreferrer">
                  {user.URL}
                </a>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* Add action buttons below the table */}
      <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Always open "Update My Profile" in the main area
            if (setSelectedPage && setSelectedUrl) {
              setSelectedPage("Update My Profile");
              setSelectedUrl(urls.UPDATE_MY_PROFILE);
            }
          }}
        >
          Edit Profile
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            window.location.href = "/logout";
          }}
        >
          Logout
        </Button>
      </Stack>
    </>
  );
}
/**
 * Styled Paper component for the observer info banner.
 */
export const ObserverInfoBanner = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "auto",
  marginBottom: theme.spacing(2),
  background: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

// Define instrument categories
const MASKED_INSTRUMENTS = ["DEIMOS", "LRIS", "LRISp"];
const LGS_AO_INSTRUMENTS = ["NIRC2", "OSIRIS"];
const NON_AO_INSTRUMENTS = ["KCWI", "DEIMOS", "LRIS", "LRISp", "HIRESb", "HIRESr", "MOSFIRE", "ESI", "KPF", "NIRES", "NIRSPEC"];

// Define checklists for each category
const CHECKLISTS = {
  all: [
    { text: "Learn about the instrument", url : urls.INSTRUMENTS_HOME, newtab: false},
    { text: "Submit observing request", url : urls.OBSERVING_REQUEST, newtab: false},
    { text: "Prepare finding charts"},
    { text: "Configure and test your remote observing software 1-5 days before your run", url : urls.SSH_KEY_MANAGEMENT, newtab: false},
    { text: "Contact your Staff Astronomer with any questions"}
  ],
  masked: [
    { text: "Submit slitmask information 5 weeks in advance", url : urls.SLITMASK_TOOL, newtab: true},
    { text: "Submit configuration forms 5 weeks in advance", url : urls.CONFIGURATION_SUBMISSION, newtab: false},
  ],
  non_ao: [
    { text: "Plan your observation using the Planning Tool", url : urls.PLANNING_TOOL, newtab: true},
    { text: "Submit your starlist", url : urls.NON_AO_STARLIST, newtab: false},
  ],
  lgs_ao: [
    { text: "Plan your observation", url : urls.PLAN_LGS_OBS, newtab: false},
    { text: "Submit your AO starlist", url : urls.AO_STARLIST, newtab: false},
  ]
};
/**
 * Returns the checklist categories for a given instrument.
 */
function getInstrumentCategories(instrument: string): string[] {
  const categories = ["all"];
  if (MASKED_INSTRUMENTS.includes(instrument)) categories.push("masked");
  if (LGS_AO_INSTRUMENTS.includes(instrument)) categories.push("lgs_ao");
  if (NON_AO_INSTRUMENTS.includes(instrument)) categories.push("non_ao");
  return categories;
}

interface ObserverBannerProps {
  user: userInfoApiResponse;
  setSelectedPage?: (page: string) => void;
  setSelectedUrl?: (url: string | null) => void; // <-- allow null
}
/**
 * ObserverInfoBannerWithSchedule displays a collapsible checklist banner
 * with upcoming observing nights and relevant tasks.
 */
export function ObserverInfoBannerWithSchedule({ user, setSelectedPage, setSelectedUrl }: ObserverBannerProps) {
  const [open, setOpen] = useState(true); // state for whole checklist
  //const obsid = 4718; // testing only
  const obsid = user?.Id;
  const { data: schedule, loading, error } = useCombinedSchedule(obsid);

  // Track open/closed state for each day
  const [openDays, setOpenDays] = useState<{ [idx: number]: boolean }>({});

  const toggleDay = (idx: number) => {
    setOpenDays(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) return <ObserverInfoBanner elevation={3}><Typography>Loading...</Typography></ObserverInfoBanner>;
  if (error) return <ObserverInfoBanner elevation={3}><Typography color="error">{error}</Typography></ObserverInfoBanner>;
  if (!schedule || schedule.length === 0) return <ObserverInfoBanner elevation={3}><Typography>No upcoming observations within 6 months.</Typography></ObserverInfoBanner>;

  return (
    <ObserverInfoBanner elevation={3}>
      {/* Banner header with collapse/expand button */}
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Typography variant="h6" gutterBottom sx={{ flexGrow: 1 }}>
          Your Observing Schedule:
        </Typography>
        <IconButton onClick={() => setOpen((prev) => !prev)} size="small">
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      {/* Collapsible checklist content */}
      <Collapse in={open} sx={{ width: "100%" }}>
        <List dense sx={{ py: 0 }}>
          {schedule.map((night, idx) => (
            <Box key={idx} sx={{ mb: 1, width: "100%" }}>
              {/* Day summary row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(0,0,0,0.03)",
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": { background: "rgba(0,0,0,0.07)" }
                }}
                onClick={() => toggleDay(idx)}
              >
                <IconButton
                  size="small"
                  onClick={e => { e.stopPropagation(); toggleDay(idx); }}
                  sx={{ mr: 1 }}
                >
                  {openDays[idx] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  <strong>{night.Date}</strong> &mdash; <strong>{night.Instrument}</strong> ({night.DaysUntil} days)
                </Typography>
              </Box>
              {/* Checklist for this day */}
              <Collapse in={!!openDays[idx]} sx={{ width: "100%" }}>
                <Box sx={{ pl: 5, pr: 2, pt: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Please look over your observing checklist:
                  </Typography>
                  <List dense sx={{ py: 0 }}>
                    {getInstrumentCategories(night.Instrument).map((category) => (
                      <Box key={category} sx={{ mb: 0.5 }}>
                        {(CHECKLISTS[category as keyof typeof CHECKLISTS] || []).map((item: ChecklistItem, i: number) => {
                          // Find the SA for this night
                          const sa = night.staff?.find(
                            (s: any) =>
                              s.Type &&
                              ["sa", "saoc"].includes(s.Type.toLowerCase()) &&
                              String(s.TelNr) === String(night.TelNr)
                          );
                          const isSAContact = item.text === "Contact your Staff Astronomer with any questions";
                          return (
                            <ListItem
                              key={i}
                              disableGutters
                              sx={{ pl: 2, py: 0.2, minHeight: 0 }}
                            >
                              {item.url ? (
                                <ListItemText
                                  primary={
                                    <Typography
                                      component="button"
                                      sx={{
                                        background: "none",
                                        border: "none",
                                        color: "primary.main",
                                        textDecoration: "underline",
                                        fontSize: "0.92rem",
                                        cursor: "pointer",
                                        lineHeight: 1.4,
                                        p: 0,
                                        m: 0,
                                        textAlign: "left",
                                        width: "100%",
                                        "&:hover": { textDecoration: "underline" },
                                      }}
                                      onClick={() => handleUrlClick(item, setSelectedPage, setSelectedUrl)}
                                    >
                                      • {item.text}
                                    </Typography>
                                  }
                                />
                              ) : (
                                <ListItemText
                                  primary={
                                    <Typography
                                      component="span"
                                      sx={{
                                        color: "text.primary",
                                        fontSize: "0.92rem",
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      • {isSAContact && sa && sa.Email ? (
                                          <>
                                            Contact your Staff Astronomer at{" "}
                                            <a
                                              href={`mailto:${sa.Email}`}
                                              style={{ color: "#1976d2", textDecoration: "underline" }}
                                            >
                                              {sa.Email}
                                            </a>
                                            {" "}with any questions
                                          </>
                                        ) : (
                                          item.text
                                        )}
                                    </Typography>
                                  }
                                />
                              )}
                            </ListItem>
                          );
                        })}
                      </Box>
                    ))}
                  </List>
                </Box>
              </Collapse>
            </Box>
          ))}
        </List>
      </Collapse>
    </ObserverInfoBanner>
  );
}