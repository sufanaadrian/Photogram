import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { Formik } from "formik";

const ContactForm = () => {
  const { palette } = useTheme();
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_d9eluvz",
        "template_97ofyrh",
        form.current,
        "GsW6xicoFtgyj3Ipk"
      )
      .then(
        (result) => {
          console.log(result.text);
          e.target.reset();
          setIsMessageSent(true);
          setShowSnackbar(true);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  return (
    // <form ref={form} onSubmit={sendEmail}>
    //   <label>Name</label>
    //   <input type="text" name="user_name" />
    //   <label>Email</label>
    //   <input type="email" name="user_email" />
    //   <label>Message</label>
    //   <textarea name="message" />
    //   <input type="submit" value="Send" />
    // </form>
    <div>
      <form ref={form} onSubmit={sendEmail}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        >
          <div style={{ gridColumn: "span 4" }}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="user_name"
            />
          </div>

          <div style={{ gridColumn: "span 4" }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="user_email"
            />
          </div>

          <div style={{ gridColumn: "span 4" }}>
            <TextField
              label="Message"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              name="message"
            />
          </div>
        </Box>

        {/* BUTTONS */}
        <Box>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              m: "2rem 0",
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              "&:hover": { color: palette.primary.main },
            }}
          >
            Send Message
          </Button>
        </Box>
      </form>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={handleCloseSnackbar}
        >
          Message sent successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ContactForm;
