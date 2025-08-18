import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from "react";
import scheduleApi from './api';
import type { ApiResponse } from './api';
import { Table } from '@mui/material';
import { TableBody } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableContainer } from '@mui/material';
import { TableHead, TableRow } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';



const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: theme.mixins.toolbar.minHeight, // so the main content is below the topbar
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

interface MainContentProps  {
  open: boolean;
};

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  
}));

export default function MainContent({ open }: MainContentProps) {
  const apiData : ApiResponse[] | null = scheduleApi();
  console.log(apiData)

  // Filter instruments by telescope number
  const keckI = apiData?.filter(item => item.TelNr === 1) || [];
  const keckII = apiData?.filter(item => item.TelNr === 2) || [];

const renderTable = (instruments: ApiResponse[]) => (
  <TableContainer component={Paper}>
    <Table size="small">
      {/* table header -> col names */}
      <TableHead>
        <TableRow>
          <TableCell>Instrument</TableCell>
          <TableCell>State</TableCell>
          <TableCell>Ready</TableCell>
        </TableRow>
      </TableHead>

      {/* actual table data */}
      <TableBody>
        {instruments.map((inst, idx) => {
          const isReady = inst.State === "Scheduled" || inst.State === "TDA Ready";
          // if this ? then this : else this
          return (
            <TableRow
              key={idx}
              sx={{
                backgroundColor: isReady ? "#95EFA3" : "#f8d7da", // green if ready, red if not
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

   return (
    <Main open={open}>
      <h1>Welcome to the Observer Portal!</h1>
      <Grid container spacing={2} sx={{ height: "85%" }}>
        <Grid size={6} sx={{ height: "100%" }}>
          <Item>
            <h2>Keck I</h2>
            {renderTable(keckI)}
          </Item>
        </Grid>
        <Grid size={6} sx={{ height: "100%" }}>
          <Item>
            <h2>Keck II</h2>
            {renderTable(keckII)}
          </Item>
        </Grid>
      </Grid>
    </Main>
  );
}