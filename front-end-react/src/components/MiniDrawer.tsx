import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Collapse } from '@mui/material';
import { FolderShared } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const brandName = 'Arael'

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function Copyright(props: any) {
  return (
    <>
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {/* {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          {brandName}
        </Link>{' '} */}
        {'Created by '}
        <Link color="inherit" href="https://mui.com/">
          {'Daresoft'}
        </Link>
        {' Solutions. '} 
        {new Date().getFullYear()}
        {'. '}
      </Typography>
    </>
    
  );
}


export default function MiniDrawer() {

  const enum menuItems {
    Dashboard = 0,
    Files = 1,
    FilesExternal = 2,
    Settings = 3,
    SignOut = 4,
    FilesTemp = 5
  }

  const[t, i18n] = useTranslation();

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState(1);
  
  const navigate = useNavigate();

  const handleMenuItemClick = (
    item: number,
  ) => {

    setSelectedItem(item);

    switch (item) {
      case menuItems.Dashboard:
        navigate("/dashboard");
        break;      
      case menuItems.Files:
        navigate("/files");
        break;
      case menuItems.FilesTemp:
        navigate("/filesTemp");
      break;
      case menuItems.FilesExternal:
        navigate("/files");
        break;      
      case menuItems.Settings:
        navigate("/settings");
        break;
      case menuItems.SignOut:
        localStorage.removeItem('paperly-token');
        navigate("/sign-in");
        break;
      default:
        console.error("Unknown menu item clicked:", item);
        break;
    }
  };
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div">
            {brandName}
          </Typography>

          <Box sx={{ flexGrow: 0, position:'absolute', right:'21px'}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/avatar-2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List component="nav" dense={true}>

          <ListItemButton 
            onClick={() => handleMenuItemClick(menuItems.Dashboard)} 
            selected={selectedItem === menuItems.Dashboard}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={t("navbar.dashboard")} />
          </ListItemButton>

          {/* <ListItemButton 
            onClick={() => handleMenuItemClick(menuItems.Files)}
            selected={selectedItem === menuItems.Files}
          >
            <ListItemIcon>
              <DriveFileMoveIcon />
            </ListItemIcon>
            <ListItemText primary={t("navbar.files")} />
          </ListItemButton> */}

          <ListItemButton 
            onClick={() => handleMenuItemClick(menuItems.FilesTemp)}
            selected={selectedItem === menuItems.FilesTemp}
          >
            <ListItemIcon>
              <DriveFileMoveIcon />
            </ListItemIcon>
            <ListItemText primary={t("navbar.files")} />
          </ListItemButton>

          {/* <ListItemButton 
            onClick={() => handleMenuItemClick(menuItems.FilesExternal)}
            selected={selectedItem === menuItems.FilesExternal}
          >
            <ListItemIcon>
              <FolderShared />
            </ListItemIcon>
            <ListItemText primary={t("navbar.filesExternal")} />
          </ListItemButton>                    */}

          <Divider />

          <ListItemButton 
            onClick={() => handleMenuItemClick(menuItems.Settings)}
            selected={selectedItem === menuItems.Settings}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t("navbar.settings")} />
          </ListItemButton>

          <Divider />

        </List>

        <span style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <List dense={true}>
            <Divider sx={{ bgcolor: theme.palette.primary.contrastText, opacity: 0.2 }} />
            <ListItemButton 
              onClick={() => handleMenuItemClick(menuItems.SignOut)}
              selected={selectedItem === menuItems.SignOut}
              sx={{color: theme.palette.primary.main}}
            >
              <ListItemIcon>
                <LogoutIcon sx={{color: theme.palette.primary.main}}/>
              </ListItemIcon>
              <ListItemText primary={t("navbar.signout")} />
            </ListItemButton>
          </List>          
        </span>    
        
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          backgroundColor: '#f6f7f880'
        }}
      >
        <DrawerHeader/>
        {/* <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity="info">You are currently seeing the development version.</Alert>
        </Stack> */}
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
        <Copyright sx={{ pt: 4, pb: 2 }} />
      </Box>
    </Box>
  );
}
