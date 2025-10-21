import { Paper } from "@mui/material";
import type { userInfoApiResponse } from "./api";
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

//import React from "react";
import { styled } from "@mui/material/styles";


import { Typography, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface ObserverInfoProps {
  user: userInfoApiResponse;      
}

export default function UserTable({ user }: ObserverInfoProps) {
  const fullName = [user.FirstName, user.MiddleName, user.LastName]
    .filter(Boolean)
    .join(" ");

  const fullAddress = [user.Street, user.City, user.State, user.Zip, user.Country]
    .filter(Boolean)
    .join(", ");

  return (
    <TableContainer component={Paper}
    sx={{
    //height: 350, /
    maxHeight: 317, // set max height, so when new items are added it will scroll
    //minHeight: 300,
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
            <TableCell><b>ID</b></TableCell>
            <TableCell>{user.Id}</TableCell>
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
  );
}

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

export function ObserverInfoMock() {
  return (
    <ObserverInfoBanner elevation={3}>
      <Typography variant="h6" gutterBottom>
        Welcome to the new Observer Portal!
      </Typography>

      <Typography variant="body1" gutterBottom>
        You are observing in <strong>20 days</strong> using <strong>KCWI</strong>.
      </Typography>

      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        Please look over your observing checklist:
      </Typography>

      <List dense>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Sumbit observing reqest" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <RadioButtonUncheckedIcon color="disabled" />
          </ListItemIcon>
          <ListItemText primary="Use the Planning Tool to create target list" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <RadioButtonUncheckedIcon color="disabled" />
          </ListItemIcon>
          <ListItemText primary="Upload starlist" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <RadioButtonUncheckedIcon color="disabled" />
          </ListItemIcon>
          <ListItemText primary="Add observers into observing request" />
        </ListItem>
      </List>
    </ObserverInfoBanner>
  );
}