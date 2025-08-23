import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse'; 

// Icons
import HomeIcon from '@mui/icons-material/Home';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

// urls
import urls from './urls.json'


const drawerWidth = 240;

// top part of side bar where the button was before -> is blank now
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

// variables to be given to side bar -> is it open and what to do when it closes
interface SidebarProps {
  open: boolean;
  handleDrawerClose: () => void;
  setSelectedPage: (page: string) => void;
  setSelectedUrl: (url: string | null) => void;
}

// type for menu items in the side bar (so they have a name, icon, and optional sub-items)
interface MenuItem {
  text: string;
  icon: React.ReactNode;
  subItems?: SubItem[];
}

interface SubItem {
  text: string;
  url: string; 
  newtab: boolean; // embed => false, open new tab => true
}

// const handleSubItemClick = (subItem: SubItem) => {
//   window.location.href = subItem.url;
// };


// ----- Component -----
export function PersistentSideBar({ open, handleDrawerClose, setSelectedPage, setSelectedUrl }: SidebarProps) {
  const theme = useTheme();

  // Track open submenu by key: 'top-0', 'bottom-1', etc.
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  
  // When clicked, change open key to either the clicked key or null if already open
  const handleClick = (key: string) => {
    setOpenKey(prevKey => (prevKey === key ? null : key));
  };

  // items for the top part of side bar above divider
  const topMenu: MenuItem[] = [
    { text: 'Home', icon: <HomeIcon /> },
    { text: 'Pre-Observing', icon: <AssignmentIcon />, 
        subItems: [
          { text: 'Telescope Time Application', url: '', newtab: false},
          { text: 'Cover Sheet', url: urls.PILOGIN + urls.COVSHEET, newtab: true}, 
          { text: 'Remote Observing Request', url: urls.PILOGIN + urls.REMOTE_OBS_SRC, newtab: false}, 
          { text: 'KPF Community Cadence', url: urls.KPF_CC, newtab: true},
          { text: 'Planning Tool', url: urls.PLANNING_TOOL, newtab: true},
          { text: 'LRIS Configuration', url: urls.LRIS_CONFIG_SRC, newtab: false } ,
          { text: 'DEIMOS Configuration', url: urls.DEIMOS_CONFIG_SRC, newtab: false},
          { text: 'Slit Mask Tool', url: urls.SLITMASK_TOOL, newtab: false},
          { text: 'ToO Request', url: urls.PILOGIN + urls.TOO_REQUEST_SRC, newtab: false},
          { text: 'Target List', url: urls.TARGET_LIST_SRC, newtab: false},
          { text: 'VSQ Reservations', url: urls.VSQ_SRC, newtab: false}
        ]
    },
    { text: 'Observing', icon: <StarBorderIcon />,
        subItems: [
          { text: 'Instrument Status (SIAS)', url: urls.SIAS_SRC, newtab: false},
          { text: 'My Observing Schedule', url: '', newtab: false },
          { text: 'My Observation Logs', url: '', newtab: false},
          { text: 'Observers\' Data Access Portal', url: urls.ODAP, newtab: true}
        ]
    },
    { text: 'Post-Observing', icon: <CloudDownloadIcon />,
        subItems: [
          { text: 'Post Observing Comments', url: urls.PILOGIN + urls.POC_SRC, newtab: false },
          { text: 'ToO Report', url: urls.PILOGIN + urls.TOO_REPORT_SRC, newtab: false}
        ]
     },
    { text: 'Resources', icon: <FolderSpecialIcon />,
        subItems: [
          { text: 'Full Telescope Schedule', url: urls.TELSCHED_SRC, newtab: false },
          { text: 'KOA', url: urls.KOA_SRC, newtab: true},
          { text: 'Instrument Info', url: urls.INST_SRC, newtab: false},
          { text: 'Maunakea Weather Center (MKWC)', url: urls.MKWC_SRC, newtab: true},
          { text: 'Keck Publications', url: urls.KPUB, newtab: true}
        ]
     },
  ];

  const bottomMenu: MenuItem[] = [
    { text: 'Settings', icon: <SettingsIcon />,
        subItems: [
          { text: 'Update Information', url: urls.PILOGIN + urls.UPDATE_INFO_SRC, newtab: false},
          { text: 'Update SSH Key', url: urls.PILOGIN + urls.SSH_SRC, newtab: false}
        ]
     },
    { text: 'Logout', icon: <LogoutIcon /> },
  ];

  const handleMenuClick = (item: MenuItem) => {
    setSelectedPage(item.text)
    setSelectedUrl(null)
  }

  const handleSubItemClickEmbed = (subItem: SubItem) => {
    setSelectedPage(subItem.text)
    setSelectedUrl(subItem.url)
  }

  const handleSubItemClickNewTab = (subItem: SubItem) => {
  window.location.href = subItem.url;
};

const handleUrlClick = (subItem: SubItem) => {
  if (subItem.newtab) {
    handleSubItemClickNewTab(subItem); // create new tab
  } else {
    handleSubItemClickEmbed(subItem); // enmbed in main area
  }
};

  // render top and bottom the same -> function to render given the menu and type
  const renderMenuList = (menu: MenuItem[], menuType: 'top' | 'bottom') => (
    <List>
      {menu.map((item, index) => {
        const key = `${menuType}-${index}`;
        const isOpen = openKey === key;

        return (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  item.subItems
                    ? handleClick(key)
                    : handleMenuClick(item)
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems ? (isOpen ? <ExpandLess /> : <ExpandMore />) : null}
              </ListItemButton>
            </ListItem>


            {item.subItems && (
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.text} disablePadding sx={{ pl: 4 }}>
                      <ListItemButton onClick={() => handleUrlClick(subItem)}>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />

      {renderMenuList(topMenu, 'top')}
      <Divider />
      {renderMenuList(bottomMenu, 'bottom')}
    </Drawer>
  );
}