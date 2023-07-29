import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import Form from "./Form";
import { useState, useEffect } from "react";
import { ArrowLeftOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const theme = useTheme();
  const [showContent, setShowContent] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);
  const scrollToForm = () => {
    window.scrollTo({
      top: document.getElementById("login-form").offsetTop,
      behavior: "smooth",
    });
  };
  return (
    <div>
      <div className="video">
        <div className="overlayVideo"></div>
        {showContent && (
          <div className="contentVideo">
            <Typography
              fontWeight="bold"
              fontSize={isNonMobile ? "120px" : "70px"}
            >
              SA-Visuals
            </Typography>
          </div>
        )}
        <Box
          sx={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <Button
            size="large"
            sx={{
              animation: "pulse 1s infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
              fontSize: "1rem",
            }}
            onClick={scrollToForm}
          >
            Log In
          </Button>
        </Box>
      </div>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/all")}
          zIndex="1"
        >
          Go back <ArrowLeftOutlined sx={{ marginLeft: "0.5rem" }} />
        </Button>

        <Box display="flex" flexWrap="wrap" justifyContent="center">
          <Box
            id="login-form"
            width={isNonMobile ? "30%" : "100%"}
            p="2rem"
            m="2rem 0"
            backgroundColor={theme.palette.background.alt}
          >
            <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
              Welcome to SA-Visuals!
            </Typography>
            <Form />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default LoginPage;
