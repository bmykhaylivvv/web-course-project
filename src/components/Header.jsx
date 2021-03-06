import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../config/firebase-config";
import { getDatabase, ref, child, get } from "firebase/database";

const Header = () => {
  const navigate = useNavigate();
  const [currentUserInfo, setCurrentUserInfo] = useState({});

  const logOut = async () => {
    try {
      await firebaseAuth.signOut();
      navigate("/signin");
    } catch (err) {
      // handle error
    }
  };

  const getUserInfo = async (userId) => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(child(dbRef, `usersInfo/${userId}`));

      if (snapshot.exists()) {
        const snapshotVal = snapshot.val();
        const currentUserInfoObject = {
          username: snapshotVal.username,
          email: snapshotVal.email,
          avatarUrl: snapshotVal.avatarUrl,
        };

        setCurrentUserInfo(currentUserInfoObject);
      } else {
        console.log("No data available");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pages = ["Feed", "Upload photo"];
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (userCred) => {
      if (!userCred) {
        navigate("/signin");
      }

      if (userCred) {
        getUserInfo(userCred.uid);
      }
    });
  }, []);

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            onClick={() => navigate("/feed")}
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Metoo
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{cursor: "pointer"}}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem
                key="Feed"
                sx={{cursor: "pointer"}}
                onClick={() => {
                  navigate("/feed");
                  handleCloseNavMenu();
                }}
              >
                <Typography textAlign="center">Feed</Typography>
              </MenuItem>
              <MenuItem
                key="Add post"
                sx={{cursor: "pointer"}}
                onClick={() => {
                  navigate("/addpost");
                  handleCloseNavMenu();
                }}
              >
                <Typography textAlign="center">Add post</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Metoo
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Button
              key="Add post"
              onClick={() => {
                navigate("/addpost");
                handleCloseUserMenu();
              }}
              sx={{ my: 2, color: "white", display: "block", cursor: "pointer" }}
            >
              Add post
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, cursor: "pointer"}}>
                <Avatar
                  alt={currentUserInfo?.username}
                  src={currentUserInfo?.avatarUrl}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                sx={{cursor: "pointer"}}
                onClick={() => {
                  navigate("/profile");
                  handleCloseUserMenu();
                }}
              >
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem
                sx={{cursor: "pointer"}}
                onClick={() => {
                  navigate("/addpost");
                  handleCloseUserMenu();
                }}
              >
                <Typography textAlign="center">Add post</Typography>
              </MenuItem>
              <MenuItem
                sx={{cursor: "pointer"}}
                onClick={() => {
                  logOut();
                  handleCloseUserMenu();
                }}
              >
                <Typography textAlign="center">Log Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
