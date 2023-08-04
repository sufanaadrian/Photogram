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
import loginimage from "../../assets/loginimage.jpg";
import compressed_loginimage from "../../assets/loginimage-min.jpg";
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

  return (
    <div>
      <div>
        <div className="image-container">
          {" "}
          {/* Add a container div */}
          <img
            src={isNonMobile ? loginimage : compressed_loginimage}
            alt="login"
            className="zoomed-image"
            style={{
              width: !isNonMobile ? "auto" : "100%",
              heigh: "100%",
              maxWidth:
                "none" /* Ensure the image doesn't have a maximum width constraint */,
              maxHeight: "none",
              objectFit: "cover",
              // transform: scale(
              //   1.1
              // ); /* Adjust the scale factor to zoom the image as needed */
            }}
          />
        </div>
        <div className="contentVideo">
          {/* Rest of your content */}
          {/* ... */}
        </div>
      </div>
      <div className="contentVideo">
        <Typography fontWeight="bold" fontSize={isNonMobile ? "120px" : "70px"}>
          SA-Visuals
        </Typography>

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
              width={isNonMobile ? "100%" : "100%"}
              p="2rem"
              m="2rem 0"
              backgroundColor="rgba(0, 0, 0, 0.4)"
            >
              <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                Welcome to SA-Visuals!
              </Typography>
              <Form />
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default LoginPage;
