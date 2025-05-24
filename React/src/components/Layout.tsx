import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Upload as UploadIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { FileImage } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/gallery":
        return "Media Gallery";
      case "/upload":
        return "Upload Media";
      case "/admin":
        return "Admin Dashboard";
      default:
        if (location.pathname.startsWith("/media/")) {
          return "Media Details";
        }
        return "Media Library";
    }
  };

  const menuItems = [
    {
      text: "Gallery",
      icon: <HomeIcon />,
      path: "/gallery",
      roles: ["viewer", "uploader", "admin"],
    },
    {
      text: "Upload Media",
      icon: <UploadIcon />,
      path: "/upload",
      roles: ["uploader", "admin"],
    },
    {
      text: "Admin Dashboard",
      icon: <AdminIcon />,
      path: "/admin",
      roles: ["admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ zIndex: theme.zIndex.drawer + 1 }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <FileImage size={32} style={{ marginRight: "12px" }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
              }}
            >
              Media Library
            </Typography>

            {!isMobile && (
              <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
                {filteredMenuItems.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      mx: 1,
                      fontWeight: isActive(item.path) ? 700 : 500,
                      borderBottom: isActive(item.path)
                        ? "2px solid white"
                        : "none",
                      borderRadius: 0,
                      paddingBottom: "4px",
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 0, ml: 2 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">
                    {user?.username || "User"} ({user?.role})
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Toolbar />
          <List>
            {filteredMenuItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={() => navigate(item.path)}
                selected={isActive(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "background.default",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              borderBottom: `1px solid ${theme.palette.divider}`,
              pb: 2,
              mb: 4,
            }}
          >
            {getPageTitle()}
          </Typography>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
