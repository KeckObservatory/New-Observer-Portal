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

type ChecklistItem = {
  task: string;
  url?: string;
  newTab?: boolean;
};

interface ObserverInfoProps {
  user: userInfoApiResponse;      
  setSelectedPage?: (page: string) => void;
  setSelectedUrl?: (url: string) => void;
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
const KPF_CC = ["KPF"]

// Define checklists for each category
const CHECKLISTS = {
  all: [
    { task: "Submit observing request", url : urls.OBSERVING_REQUEST},
    { task: "Prepare finding charts"},
    { task: "Configure and test your remote observing software", url : urls.SSH_KEY_MANAGEMENT}
  ],
  masked: [
    { task: "Submit slitmask information 5 weeks in advance", url : urls.SLITMASK_TOOL },
    { task: "Submit configuration forms 5 weeks in advance", url : urls.CONFIGURATION_SUBMISSION },
    //{ task: "", url : ""}
  ],
  non_ao: [
    { task: "Plan your observation", url : urls.PLANNING_TOOL, newTab: true},
    { task: "Submit your starlist", url : urls.NON_AO_STARLIST},
  ],
  lgs_ao: [
    { task: "Plan your LGS observation", url : urls.PLAN_LGS_OBS},
    { task: "Submit your AO starlist", url : urls.AO_STARLIST},
  ],
  kpf_cc: [
    { task: "Submit observing blocks", url : urls.KPF_CC_OBS_BLOCK_SUBMISSION, newTab: true},
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
  if (KPF_CC.includes(instrument)) categories.push("kpf_cc");
  return categories;
}

interface ObserverBannerProps {
  user: userInfoApiResponse;
  setSelectedPage?: (page: string) => void;
  setSelectedUrl?: (url: string) => void;
}
/**
 * ObserverInfoBannerWithSchedule displays a collapsible checklist banner
 * with upcoming observing nights and relevant tasks.
 */
export function ObserverInfoBannerWithSchedule({ user, setSelectedPage, setSelectedUrl }: ObserverBannerProps) {
  const [open, setOpen] = useState(true); // state for collapse
  const obsid = user?.Id;
  const { data: schedule, loading, error } = useCombinedSchedule(obsid);

  if (loading) return <ObserverInfoBanner elevation={3}><Typography>Loading...</Typography></ObserverInfoBanner>;
  if (error) return <ObserverInfoBanner elevation={3}><Typography color="error">{error}</Typography></ObserverInfoBanner>;
  if (!schedule || schedule.length === 0) return <ObserverInfoBanner elevation={3}><Typography>No upcoming observations within 2 months.</Typography></ObserverInfoBanner>;

  return (
    <ObserverInfoBanner elevation={3}>
    {/* Banner header with collapse/expand button */}
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Typography variant="h6" gutterBottom sx={{ flexGrow: 1 }}>
          Welcome to the new Observer Portal!
        </Typography>
        <IconButton onClick={() => setOpen((prev) => !prev)} size="small">
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      {/* Collapsible checklist content */}
      <Collapse in={open} sx={{ width: "100%" }}>
        {schedule.map((night, idx) => (
          <Box key={idx} sx={{ mb: 2, width: "100%" }}>
            <Typography variant="body1" gutterBottom>
              You are observing in <strong>{night.DaysUntil}</strong> days using <strong>{night.Instrument}</strong> on <strong>{night.Date}</strong>.
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Please look over your observing checklist:
            </Typography>
            <List dense sx={{ py: 0 }}>
              {getInstrumentCategories(night.Instrument).map((category) => (
                <Box key={category} sx={{ mb: 0.5 }}>
                  {(CHECKLISTS[category as keyof typeof CHECKLISTS] || []).map((item: ChecklistItem, idx: number) => (
                    <ListItem
                      key={idx}
                      disableGutters
                      sx={{ pl: 2, py: 0.2, minHeight: 0 }}
                    >
                      {item.url ? (
                        item.newTab ? (
                          <ListItemText
                            primary={
                              <Typography
                                component="a"
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: "primary.main",
                                  textDecoration: "underline",
                                  fontSize: "0.92rem",
                                  cursor: "pointer",
                                  lineHeight: 1.4,
                                }}
                              >
                                • {item.task}
                              </Typography>
                            }
                          />
                        ) : (
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                sx={{
                                  color: "primary.main",
                                  textDecoration: "underline",
                                  fontSize: "0.92rem",
                                  cursor: "pointer",
                                  lineHeight: 1.4,
                                }}
                                onClick={() => {
                                  setSelectedPage?.(item.task);
                                  setSelectedUrl?.(item.url ||"");
                                }}
                              >
                                • {item.task}
                              </Typography>
                            }
                          />
                        )
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
                              • {item.task}
                            </Typography>
                          }
                        />
                      )}
                    </ListItem>
                  ))}
                </Box>
              ))}
            </List>
          </Box>
        ))}
      </Collapse>
    </ObserverInfoBanner>
  );
}