import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';



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
  return (
    <Main open={open}>
      <h1>Welcome to the Observer Portal!</h1>
       <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Top tall rectangles */}
        <Grid size={6} sx={{ height: '100%' }}>
          <Item><h2> Keck I</h2></Item>
        </Grid>
        <Grid size={6} sx={{ height: '100%' }}>
          <Item><h2>Keck II</h2></Item>
        </Grid>

        {/* Bottom long rectangles */}
        <Grid size={12} sx={{ height: '34%' }}>
          <Item>Long 1</Item>
        </Grid>
        <Grid size={12} sx={{ height: '34%' }}>
          <Item>Long 2</Item>
        </Grid>
      </Grid>
    </Main>
  );
}