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
import FlexBetween from "components/FlexBetween";

const ContactPage = () => {
  const theme = useTheme();
  const [showContent, setShowContent] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 6010);

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
      <Box
        sx={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 1,
        }}
      ></Box>
      <Box margin="2rem">
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
            <Typography fontWeight="500" variant="h5" sx={{ mb: "1rem" }}>
              Hi,
            </Typography>
            <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
              This is Adi, fill up the form below so we can get in touch.
            </Typography>
            <Typography fontSize="0.8rem" fontWeight="500" mb="0.3rem">
              Contact info:
            </Typography>
            <Box gap="0.5rem" marginBottom="1rem">
              <FlexBetween>
                <Box>
                  <Typography fontSize={"smaller"}>Email</Typography>{" "}
                  <Typography fontWeight="500">
                    adrian1sufana@gmail.com
                  </Typography>
                </Box>
                <Box>
                  <Typography fontSize={"smaller"}>Phone</Typography>{" "}
                  <Typography fontWeight="500">0737061086</Typography>
                </Box>
              </FlexBetween>
            </Box>
            <Form />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ContactPage;
