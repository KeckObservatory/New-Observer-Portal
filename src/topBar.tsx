import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {  Box } from "@mui/material";
import { Avatar} from "@mui/material";
import type { userInfoApiResponse } from "./api";



const drawerWidth = 240;

// updating clock
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}


interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface TopBarProps  {
  open: boolean;
  handleDrawerOpen: () => void;
  user: userInfoApiResponse; 
};

export default function TopBar({ open, handleDrawerOpen, user }: TopBarProps) {
  const now = useClock();
  const ut = now.toISOString().slice(11, 19); // ut time
  const hstDate = new Date(now.getTime() - 10 * 60 * 60 * 1000);
  const hst = hstDate.toISOString().slice(11, 19); //hst time

  return (
    <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          {!open && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Observer Portal
          </Typography>

          <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
            {/* Clock section */}
            <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
              <AccessTimeIcon fontSize="large" sx={{ mr: 2 }} />
              <Box display="flex" gap={4}>
                <Typography variant="h5">UT: {ut}</Typography>
                <Typography variant="h5">HST: {hst}</Typography>
              </Box>
            </Box>

            {/* Profile avatar bubble */}
            <IconButton sx={{ p: 0 }}>
              <Avatar
                alt={user?.FirstName ?? "User"}
                src={user?.ProfilePictureURL || undefined}
                sx={{ width: 40, height: 40 }}
              >
                {(user?.FirstName?.[0] ?? "").toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

        </Toolbar>  

      </StyledAppBar>
  );
}