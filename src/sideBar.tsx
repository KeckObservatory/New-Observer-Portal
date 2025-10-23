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
import Typography from '@mui/material/Typography';


// Icons
import HomeIcon from '@mui/icons-material/Home';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CreateIcon from '@mui/icons-material/Create';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

// urls
import urls from './urls.json'
import type { userInfoApiResponse } from './api';

import { getEmployeeLinks } from './api';

const drawerWidth = 240;

// top part of side bar -> is blank now
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
  setSelectedUrl: (url: string | null) => void; // to embed url inside app
  user: userInfoApiResponse | null;
}

// type for menu items in the side bar (so they have a name, icon, and optional sub-items)
interface MenuItem {
  text: string;
  icon: React.ReactNode;
  subItems?: SubItem[]; // optional 
  // add these two if there is no subitesm
  url?: string;       
  newtab?: boolean;   
}

// subitems can now have other subitems
interface SubItem {
  text: string;
  url?: string; // url link
  newtab?: boolean; // if true -> open in new tab, false -> embed in app
  subItems?: SubItem[]; // optional nested subitems
}


// ----- Component -----
export function PersistentSideBar({ open, handleDrawerClose, setSelectedPage, setSelectedUrl, user }: SidebarProps) {
  const theme = useTheme();

  const [employeeLinks, setEmployeeLinks] = React.useState<{ name: string; url: string }[]>([]);

  React.useEffect(() => {
    if (user?.Id) {
      getEmployeeLinks(user.Id).then((result) => {
        // If result.links exists and is an array, use it; otherwise, set to []
        if (Array.isArray(result?.links)) {
          setEmployeeLinks(result.links);
        } else {
          setEmployeeLinks([]);
        }
      });
    }
  }, [user?.Id]);

  console.log("Employee Links:", employeeLinks);

  // track which menu items are open (can be more than one) with boolean
  // true -> open, false -> closed
  const [openKeys, setOpenKeys] = React.useState<Record<string, boolean>>({});

  // open/close for a given key (menu item)
  const handleToggle = (key: string) => {
    setOpenKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // when clicking a menu item without subitems
  const handleMenuClick = (item: MenuItem) => {
    setSelectedPage(item.text);
    if (item.url) {
      if (item.newtab) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
        setSelectedUrl(null);
      } else {
        setSelectedUrl(item.url);
      }
    } else {
      setSelectedUrl(null);
    }
  };

  // when clicking a subitem with a url
  const handleSubItemClickEmbed = (subItem: SubItem) => {
    setSelectedPage(subItem.text)
    setSelectedUrl(subItem.url || null)
  }

  // when clicking a subitem that should open in a new tab
  const handleSubItemClickNewTab = (subItem: SubItem) => {
    window.open(subItem.url, '_blank', 'noopener,noreferrer');
  };

  // decide what to do when clicking a subitem, new tab or embed based off "newtab" boolean
  const handleUrlClick = (subItem: SubItem) => {
    if (subItem.newtab) {
      handleSubItemClickNewTab(subItem);
    } else {
      handleSubItemClickEmbed(subItem);
    }
  };

  // items for the top part of side bar above divider
  const topMenu: MenuItem[] = [
    { text: 'Home', icon: <HomeIcon /> },

    { text: "Profile", icon: <AccountBoxIcon />,
      subItems: [
        { text: "Update My Profile", url: urls.UPDATE_MY_PROFILE, newtab: false },
        { text: "SHH Key Management", url: urls.SSH_KEY_MANAGEMENT, newtab: false },
        { text: "My Observing Schedule (new)"},
        { text: "My Observing Logs (new)"},
        { text: "My Observing Requests (to add)"},
        { text: "My Cover Sheets (to add)"},
      ]
    },

    { text: "Telescope Schedule", icon: <CalendarMonthIcon />, url: urls.TELESCOPE_SCHEDULE, newtab: false },
    
    { text: "Weather Conditions", icon: <AcUnitIcon />, 
      subItems: [
        { text: "Maunakea Weather Center", url : urls.MK_WEATHER_CENTER, newtab: true},
        { text : "Keck Cloud Cameras", url : urls.CLOUD_CAMS, newtab: false}
      ]
    },
    { text: "Pre-Observing Support", icon: <ChecklistIcon />,
      subItems: [
        { text: "Instrument Home", url: urls.INSTRUMENTS_HOME, newtab: false},
        { text: "Applying for Keck Time", 
          subItems: [
            { text: "Observing Information", url: urls.OBSERVING_INFORMATION, newtab: false},
            { text: "My Cover Sheets (to add)", url: "", newtab: false},
            { text: "Coversheet Submission", url: urls.COVER_SHEET_SUBMISSION, newtab: false},
            { text: "KPF-CC Observing Block Submission", url : urls.KPF_CC_OBS_BLOCK_SUBMISSION, newtab: false},
          ]
        },
        { text: "DEIMOS/LRIS Support", 
          subItems: [
            { text: "Configuration Submission", url: urls.CONFIGURATION_SUBMISSION, newtab: false},
            { text: "Slitmask Submission", url: urls.SLITMASK_SUBMISSION , newtab: false },
          ]
        },
        { text: "Target of Opportunity (ToO)",
          subItems: [
            { text: "ToO Policies", url: urls.ToO_POLICIES, newtab: false },
            { text: "ToO Request Tool", url: urls.ToO_REQUEST_TOOL, newtab: false },
          ]
        },
        { text: "Target Planning",
          subItems: [
            { text: "Target List Management", url: urls.TARGET_LIST_MANAGEMENT, newtab: false},
            { text: "Planning Tool", url: urls.PLANNING_TOOL, newtab: true },
          ]
        },
        { text: "HQ and Remote Observing",
          subItems: [
            { text: "Observing Request", url: urls.OBSERVING_REQUEST, newtab: false},
            { text: "VSQ Reservations", url: urls.VSQ_RESERVATIONS, newtab: false },
          ]
        },
        { text: "Remote Observing Software (to add)", url: urls.REMOTE_OBS_SOFTWARE, newtab: true},
      ]
    },
    { text: "Observing Support", icon: <FolderSpecialIcon />,
      subItems: [
        { text: "Instruments Home", url: urls.INSTRUMENTS_HOME, newtab: false},
        { text: "Staff Astronomers", url: urls.STAFF_ASTRONOMERS, newtab: false },
        { text: "Instrument Status (SIAS)", url: urls.SIAS, newtab: false },
        { text: "KPF-CC Dashboard", url: urls.KPF_CC, newtab: true},
        { text: "Keola (Observing Logs) (to add)", url: urls.KEOLA, newtab: false },
        ]
    },
    { text: "Post-Observing Support", icon: <AssignmentIcon />,
      subItems: [
        { text: "Post Observing Comment Form", url: urls.POST_OBS_COMMENTS, newtab: false},
        { text: "Data Reduction Pipelines", url: urls.DRPS, newtab: false},
      ]
    },
    { text: "Data Access", icon: <CloudDownloadIcon />,
      subItems: [
        { text: "Keck Observatory Archive", url: urls.KOA, newtab: true},
        { text: "Data Discovery Service", url: urls.DDS, newtab: true },
        { text: "Observers\' Data Access Portal", url: urls.ODAP, newtab: true},
        { text: "My KOA Data (to add)", url: "", newtab: true},
      ]
    },
    { text: "Publication Ackowledgement", icon:   <CreateIcon /> , url: urls.PUB_ACK, newtab: false}
    ];

    // for keck employees only, add extra admin section
    if (employeeLinks.length > 0) {
    topMenu.push({
      text: "Admin/Keck Employee",
      icon: <AdminPanelSettingsIcon />,
      subItems: employeeLinks.map(link => ({
        text: link.name,
        url: link.url,
        newtab: false
      }))
    });
  }
  const bottomMenu: MenuItem[] = [

    { text: "Logout (to add)", icon:   <LogoutIcon /> , url: urls.LOGOUT, newtab: false}

  ]

  // Recursive renderer for subItems (subtabs)
  // parentKey: unique number of each "parent" menu item

  function renderSubItems(subItems: SubItem[], parentKey: string, level = 1) {
    return (
      <List component="div" disablePadding>
        {subItems.map((subItem, idx) => {
          const key = `${parentKey}-sub-${idx}`;
          // quick function to check if the subitem has children (more subitems)
          const hasChildren = !!subItem.subItems && subItem.subItems.length > 0;
          return (
            <React.Fragment key={subItem.text}>
              {/* each subitem is a ListItem with a button (click -> open/close or open url) */}
              <ListItem disablePadding sx={{ pl: 2 + level * 2 }}>
                <ListItemButton
                  onClick={() => {
                    // if the subitem has children (subitems) -> it can be toggled open are closed
                    if (hasChildren) handleToggle(key);
                    // if no children -> decide how to open the url
                    else if (subItem.url) handleUrlClick(subItem);
                    // if new page -> set page there is no url
                    else setSelectedPage(subItem.text); 
                  }}
                >
                  {/* Use Typography for subtabs to make text smaller */}
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {subItem.text}
                  </Typography>
                  {/* only show a expand/less/more arrow if there are children */}
                  {hasChildren ? (openKeys[key] ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItemButton>
              </ListItem>
              {/* if there are children, render them one by one */}
              {hasChildren && (
                <Collapse in={openKeys[key]} timeout="auto" unmountOnExit>
                  {renderSubItems(subItem.subItems!, key, level + 1)}
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    );
  }

  // Render menu (top or bottom)
  const renderMenuList = (menu: MenuItem[], menuType: 'top' | 'bottom') => (
    <List>
      {menu.map((item, index) => {
        // each big menu item has a unique key (number) of its index
        const key = `${menuType}-${index}`;
        // is it open/expanded or closed?
        const isOpen = !!openKeys[key];
        return (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  item.subItems
                    ? handleToggle(key)
                    : handleMenuClick(item)
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {/* only show a expand/less/more arrow if there are subitems */}
                {item.subItems ? (isOpen ? <ExpandLess /> : <ExpandMore />) : null}
              </ListItemButton>
            </ListItem>
            {item.subItems && (
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                {renderSubItems(item.subItems, key)}
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