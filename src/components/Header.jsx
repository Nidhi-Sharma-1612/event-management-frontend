import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  ExitToApp,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import eventService from "../services/eventService";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const joinedEventId = localStorage.getItem("joinedEventId");

    if (storedUser?.role === "guest") {
      if (joinedEventId) {
        try {
          await eventService.leaveEvent(joinedEventId);
          localStorage.removeItem("joinedEventId");
        } catch (error) {
          console.error("❌ Error leaving event:", error);
        }
      }
    } else {
      // ✅ Remove session for registered users
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    navigate("/login");
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "blue" }}>
        <Toolbar className="flex justify-between w-full">
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            className="text-white font-bold no-underline"
          >
            🗓️ Event Manager
          </Typography>

          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center gap-2 text-white font-bold ml-auto">
              <AccountCircle fontSize="small" />
              <Typography variant="body1">
                {user?.role === "guest" ? "Guest" : user?.name || ""}
              </Typography>
            </div>
          )}

          {/* Logout Button (Only visible on large screens) */}
          {user && (
            <Button
              onClick={handleLogout}
              sx={{
                color: "white",
                marginLeft: "20px",
                display: { xs: "none", md: "flex" }, // Hide on small screens
              }}
              startIcon={<ExitToApp />}
            >
              Logout
            </Button>
          )}

          {/* Mobile Menu Icon (Only visible on small screens) */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: "white",
              display: { xs: "block", md: "none" }, // Hide on large screens
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <List className="w-48">
          {/* User Info in Drawer */}
          {user && (
            <ListItem>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText
                primary={user?.role === "guest" ? "Guest" : user?.name || ""}
              />
            </ListItem>
          )}

          {/* Logout Button (Visible on mobile inside menu) */}
          {user && (
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
