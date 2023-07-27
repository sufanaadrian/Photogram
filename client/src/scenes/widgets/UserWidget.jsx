import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  ArrowDropDownOutlined,
  ArrowDropUpOutlined,
  Facebook,
  Instagram,
  CompressOutlined,
} from "@mui/icons-material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CameraIcon from "@mui/icons-material/Camera";
import { Box, Typography, Divider, useTheme, Link } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const loggedInUserId = useSelector((state) => state.user?._id ?? null);

  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const { firstName, lastName, location, cameraBody, cameraLens } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}

      {!isProfileDropdown && (
        <div>
          <FlexBetween
            gap="0.5rem"
            pb="1.1rem"
            // onClick={() => navigate(`/profile/${userId}`)}
          >
            <FlexBetween gap="1rem">
              <UserImage image={picturePath} />
              <Box>
                <Typography
                  variant="h4"
                  color={dark}
                  fontWeight="500"
                  fontSize="clamp(0.5rem, 1rem, 1.5rem)"
                  sx={{
                    "&:hover": {
                      color: palette.primary.dark,
                      cursor: "pointer",
                    },
                  }}
                >
                  {firstName} {lastName}
                </Typography>
              </Box>
            </FlexBetween>
            {loggedInUserId && <ManageAccountsOutlined />}
          </FlexBetween>

          <Divider />

          {/* SECOND ROW */}
          <Box p="1rem 0">
            <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
              <LocationOnOutlined fontSize="small" sx={{ color: main }} />
              <Typography color={medium}>{location}</Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              gap="1rem"
              paddingTop="0.5rem"
            >
              <CameraAltOutlinedIcon fontSize="small" sx={{ color: main }} />
              <Typography color={medium}>{cameraBody}</Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              gap="1rem"
              paddingTop="0.4rem"
            >
              <CameraIcon fontSize="small" sx={{ color: main }} />
              <Typography color={medium}>{cameraLens}</Typography>
            </Box>
          </Box>

          <Divider />

          {/* FOURTH ROW */}
          <Box p="0.5rem 0">
            <Typography
              fontSize="0.8rem"
              color={main}
              fontWeight="500"
              mb="0.3rem"
            >
              Social Profiles
            </Typography>
            <FlexBetween gap="0.5rem">
              <FlexBetween gap="1rem">
                <Instagram fontSize="large" sx={{ color: main }} />
                <Box>
                  <Typography fontSize={"smaller"} color={medium}>
                    Instagram
                  </Typography>{" "}
                  <a
                    href="https://www.instagram.com/sufana.adi"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography color={main} fontWeight="500">
                      @sufana.adi
                    </Typography>
                  </a>
                </Box>
              </FlexBetween>
              {loggedInUserId && <EditOutlined sx={{ color: main }} />}
            </FlexBetween>
            <FlexBetween gap="0.5rem" sx={{ marginTop: "10px" }}>
              <FlexBetween gap="1rem">
                <Facebook fontSize="large" sx={{ color: main }} />

                <Box>
                  <Typography fontSize={"smaller"} color={medium}>
                    Facebook
                  </Typography>
                  <a
                    href="https://www.facebook.com/sufana.adi"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography color={main} fontWeight="500">
                      @sufana.adi
                    </Typography>
                  </a>
                </Box>
              </FlexBetween>
              {loggedInUserId && <EditOutlined sx={{ color: main }} />}
            </FlexBetween>
          </Box>
        </div>
      )}
      <Box
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
        {isProfileDropdown ? (
          <ArrowDropDownOutlined />
        ) : (
          <ArrowDropUpOutlined />
        )}
        <Typography>
          {isProfileDropdown ? "Display profile" : "Hide profile"}
        </Typography>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
