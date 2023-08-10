import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { Button, Divider, useMediaQuery } from "@mui/material";
import { Box, makeS } from "@mui/system";
import {
  TouchAppOutlined,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const primaryDarkColor = palette.primary.dark;
  const [user, setUser] = useState(null);

  const alt = palette.background.alt;
  const navigate = useNavigate();
  const theme = useTheme();
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const loggedInUserId = useSelector((state) => state.user?._id ?? null);

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const scrollToForm = () => {
    window.scrollTo({
      top: document.getElementById("highlights").offsetTop,
      behavior: "smooth",
    });
  };
  const getUser = async () => {
    if (!loggedInUserId) {
      console.log("User is not logged in");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users/${loggedInUserId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.log("Error fetching user data:", response.statusText);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, [loggedInUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    setUser("undefined");
  }

  const { firstName, lastName, location, cameraBody, cameraLens } = user || {};
  return (
    <>
      {isNonMobileScreens && (
        <Box sx={{ marginTop: "1rem" }}>
          <Typography className="word">
            <span>H</span>
            <span>I</span>
            <span>G</span>
            <span>H</span>
            <span>L</span>
            <span>I</span>
            <span>G</span>
            <span>H</span>
            <span>T</span>
            <span>S</span>
          </Typography>
        </Box>
      )}

      <Box className={isNonMobileScreens ? "sticky" : ""}>
        {isNonMobileScreens && <Divider sx={{ margin: "0.5rem" }} />}
        <Box
          className={isNonMobileScreens ? "sticky" : ""}
          height="auto"
          maxWidth="500px"
          mx="auto"
          p="1rem 2rem"
          borderRadius="1rem"
          textAlign="center"
          backgroundColor={alt}
        >
          {!isProfileDropdown && (
            <Box>
              {loggedInUserId ? (
                <Typography variant="h4" fontWeight="bold" mb={2}>
                  Hello {firstName}
                </Typography>
              ) : (
                <Typography variant="h4" fontWeight="bold" mb={2}>
                  Hello
                </Typography>
              )}

              <img
                src={`${BASE_URL}/assets/final_logo.png`}
                alt="Gallery Advert"
                style={{
                  width: "100%",
                  borderRadius: "1rem",
                  marginBottom: "1rem",
                }}
              />
              <Typography color="textSecondary" mb={1}>
                Welcome to my gallery.
              </Typography>
              <Typography color="textSecondary" mb={1}>
                Discover new places, experiences, and moments through my lens.
              </Typography>
              <Typography color="textSecondary" mb={1}>
                If you like any of my work, feel free to get in touch.
              </Typography>
              <Box
                sx={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}
              >
                <Box flex={1}>
                  <Typography color="textSecondary" mb={2}>
                    This is the highlights page. Check them out by scrolling
                    down.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <Button
                      onClick={scrollToForm}
                      variant="contained"
                      color="primary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Scroll down{" "}
                      <ArrowDownward sx={{ marginLeft: "0.5rem" }} />
                    </Button>
                  </Box>
                </Box>
                <Box flex={1}>
                  <Typography color="textSecondary" mb={2}>
                    The full gallery is available in the Gallery page.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/all")}
                  >
                    Open gallery{" "}
                    <TouchAppOutlined sx={{ marginLeft: "0.5rem" }} />
                  </Button>
                </Box>
              </Box>

              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  &copy; 2023 SufanaA. All rights reserved.
                </Typography>
              </Box>
            </Box>
          )}

          <Box
            marginTop={1}
            display="flex"
            justifyContent="center"
            onClick={() => setIsProfileDropdown(!isProfileDropdown)}
            sx={{
              "&:hover": {
                color: palette.primary.dark,
                cursor: "pointer",
              },
            }}
          >
            {isProfileDropdown ? <ArrowDownward /> : <ArrowUpward />}
            <Typography>{isProfileDropdown ? "Show " : "Hide"}</Typography>
          </Box>
        </Box>
        {!isNonMobileScreens && (
          <Box id="highlights" sx={{ marginTop: "80px" }}>
            <Typography className="word">
              <span>H</span>
              <span>I</span>
              <span>G</span>
              <span>H</span>
              <span>L</span>
              <span>I</span>
              <span>G</span>
              <span>H</span>
              <span>T</span>
              <span>S</span>
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default AdvertWidget;
