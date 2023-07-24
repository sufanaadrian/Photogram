import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { Button, Divider, useMediaQuery } from "@mui/material";
import { Box, makeS } from "@mui/system";
import { TouchAppOutlined, ArrowDownward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const primaryDarkColor = palette.primary.dark;
  const alt = palette.background.alt;
  const navigate = useNavigate();
  const theme = useTheme();

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return (
    <>
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "1rem",
          animation: "floatAnimation 2s ease-in-out infinite", // Apply the animation permanently
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Scroll down
          <ArrowDownward sx={{ marginLeft: "0.5rem" }} />
        </Button>
      </Box>
      <Divider sx={{ margin: "2rem" }} />
      <Box
        className="sticky"
        height="auto"
        maxWidth="500px"
        mx="auto"
        p="1rem 2rem"
        borderRadius="1rem"
        textAlign="center"
        backgroundColor={alt}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Hello!
        </Typography>
        <img
          src={`${BASE_URL}/assets/logo.png`}
          alt="Gallery Advert"
          style={{
            width: "100%",
            borderRadius: "1rem",
            marginBottom: "1rem",
          }}
        />
        <Typography color="textSecondary" mb={2}>
          Explore beautiful photos and memories captured by me, a passionate
          photographer.
        </Typography>
        <Typography color="textSecondary" mb={2}>
          Discover new places, experiences, and moments through my lens.
        </Typography>
        <Typography color="textSecondary" mb={2}>
          The full gallery is available in the Gallery page. Check it out by
          pressing the button below.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/all")}
        >
          Open gallery
          <TouchAppOutlined sx={{ marginLeft: "0.5rem" }} />
        </Button>
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            &copy; 2023 SufanaA. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default AdvertWidget;
