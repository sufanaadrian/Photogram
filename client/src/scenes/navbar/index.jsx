import { useState } from "react";
import "../../index.css";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  CollectionsOutlined,
  Email,
  Menu,
  Close,
  ArrowBack,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  MenuItem,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import BASE_URL from "../../config"; // Import the BASE_URL

import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setLogin } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const isDesktop = useMediaQuery("(min-width: 1000px)"); //if width >1000 we are on desktop
  const loggedInUserId = useSelector((state) => state.user?._id ?? null);
  const [isMobileDropDownPressed, setIsMobileDropDownPressed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAllPath = /^\/all($|\/)/.test(window.location.pathname);
  const theme = useTheme();
  const darkColor = theme.palette.neutral.dark;
  const backgroundColor = theme.palette.background.default;
  const primaryDarkColor = theme.palette.primary.dark;
  const alternativeColor = theme.palette.background.alt;
  return (
    <FlexBetween padding="0.5rem 2%" backgroundColor={alternativeColor}>
      <FlexBetween gap="1.75rem">
        {isAllPath ? (
          <Box>
            <Typography
              color="primary"
              fontWeight="bold"
              textOverflow="ellipsis"
              fontSize="clamp(0.5rem, 1.2rem, 1.7rem)"
              onClick={() => navigate("/")}
              sx={{
                "&:hover": {
                  color: primaryDarkColor,
                  cursor: "pointer",
                },
              }}
              className="title"
            >
              <ArrowBack
                style={{
                  fontSize: "clamp(0.5rem, 1.2rem, 1.7rem)",
                  marginBottom: "-0.2rem",
                }}
              />
              Back to highlights
            </Typography>
          </Box>
        ) : (
          <Typography
            color="primary"
            fontWeight="bold"
            textOverflow="ellipsis"
            fontSize="clamp(0.2rem, 0.8rem, 1.35rem)"
            sx={{
              "&:hover": {
                color: primaryDarkColor,
                cursor: "pointer",
              },
              display: "flex", // Use flexbox to center the items
              alignItems: "center", // Center items along the vertical axis
            }}
            className="title"
          >
            <img
              src={`${BASE_URL}/assets/logo_latest.png`}
              alt="Logo"
              style={{
                height: "50px",
                marginRight: "10px",
                marginLeft: "10px",
              }}
            />
          </Typography>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isDesktop ? (
        <FlexBetween gap="1rem">
          <MenuItem value="Gallery" onClick={() => navigate(`/all`)}>
            <CollectionsOutlined
              sx={{ fontSize: "35px" }}
            ></CollectionsOutlined>
            <Typography>Gallery</Typography>
          </MenuItem>
          <MenuItem value="Contact" onClick={() => navigate(`/contact`)}>
            <Email sx={{ fontSize: "35px" }}></Email>
            <Typography>Contact</Typography>
          </MenuItem>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <LightMode sx={{ fontSize: "20px" }} />
            ) : (
              <DarkMode sx={{ color: darkColor, fontSize: "20px" }} />
            )}
          </IconButton>
          {/* <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem> */}
          {loggedInUserId !== null ? (
            <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
          ) : (
            <MenuItem onClick={() => navigate("/login")}>Log In</MenuItem>
          )}
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileDropDownPressed(!isMobileDropDownPressed)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isDesktop && isMobileDropDownPressed && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="300px"
          minWidth="100px"
          backgroundColor={backgroundColor}
        >
          {/* MENU ITEMS */}
          <FlexBetween flexDirection="column" justifyContent="center">
            <MenuItem value="Gallery" onClick={() => navigate(`/all`)}>
              <CollectionsOutlined
                sx={{ fontSize: "35px" }}
              ></CollectionsOutlined>
              <Typography p="2rem 0rem">Gallery</Typography>
            </MenuItem>
            <MenuItem value="Contact" onClick={() => navigate(`/contact`)}>
              <Email sx={{ fontSize: "35px" }}></Email>
              <Typography p="2rem 0rem">Contact</Typography>
            </MenuItem>
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "20px" }}
            >
              {theme.palette.mode === "dark" ? (
                <LightMode sx={{ fontSize: "20px" }} />
              ) : (
                <DarkMode sx={{ color: darkColor, fontSize: "20px" }} />
              )}
            </IconButton>
            <Box
              marginTop="1rem"
              border="1px solid"
              borderRadius="12%"
              padding="1rem"
            >
              {loggedInUserId !== null ? (
                <Typography
                  onClick={() => dispatch(setLogout())}
                  fontSize="15px"
                  fontWeight="bold"
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      transition: "all 0.3s",
                      transform: "scale(1.1) ",
                    },
                  }}
                >
                  Log Out
                </Typography>
              ) : (
                <Typography
                  onClick={() => navigate("/login")}
                  fontSize="15px"
                  fontWeight="bold"
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      transition: "all 0.3s",
                      transform: "scale(1.1) ",
                    },
                  }}
                >
                  Log In
                </Typography>
              )}
            </Box>
          </FlexBetween>
          {/* CLOSE ICON */}
          <Box position="fixed" bottom="0" p="0rem 1.5rem">
            <MenuItem
              value="Close"
              sx={{
                "&:hover": {
                  color: "red",
                  cursor: "pointer",
                  backgroundColor: backgroundColor,
                  transition: "all 0.3s",
                  transform: "scale(1.4) rotate(180deg)",
                },
              }}
              onClick={() =>
                setIsMobileDropDownPressed(!isMobileDropDownPressed)
              }
            >
              <Close sx={{ fontSize: "35px" }}></Close>
            </MenuItem>
          </Box>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
