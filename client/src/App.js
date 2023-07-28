import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ContactPage from "scenes/contactPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  const mode = useSelector((state) => state.mode);

  const theme = useMemo(() => {
    // If mode is explicitly set to "dark", use the dark themeSettings
    if (mode === "light") {
      return createTheme(themeSettings("dark"));
    } else {
      // Otherwise, use the light themeSettings (fallback for other modes)
      return createTheme(themeSettings("light"));
    }
  }, [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route path="/all" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
