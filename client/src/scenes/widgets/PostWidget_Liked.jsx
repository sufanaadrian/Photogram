import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  InfoOutlined,
  RemoveCircleOutlined,
  MoreVert,
  DeleteOutline,
  FileDownloadOutlined,
  EditLocationAltOutlined,
  CategoryOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Paper,
  ListItemText,
  ListItemIcon,
  ListItem,
  List,
  Popper,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";

import FlexBetween from "components/FlexBetween";
import UploadDetails from "components/PhotoUpload";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { useNavigate } from "react-router-dom";
import { getUserPosts } from "components/api";
import { getPostsAll } from "components/api";
import BASE_URL from "../../config";
const PostWidget_Liked = ({
  postId,
  postUserId,
  name,
  description,
  cameraBody,
  cameraLens,
  location,
  picturePath,
  userPicturePath,
  likes,
  isSharable,
  comments,
  exifData,
  isLargeGrid,
  isProfile,
  dominantColors,
  imageType,
  role,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) =>
    state.user ? state.user._id : null
  );
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const isAdmin = role === "admin";
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showExifData, setShowExifData] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorComments, setAnchorComments] = useState(null);
  const [showIconButton, setShowIconButton] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Track the currently selected image
  const [newLocation, setNewLocation] = useState(description);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState(""); // You can set the severity based on the action
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };
  const regex = /\/all/;
  const exifDataObject = JSON.parse(exifData);
  const navigate = useNavigate();
  let initialScrollPosition = window.scrollY;
  const SCROLL_THRESHOLD = 100;
  const timerRef = useRef(null); // Ref to hold the timer ID
  useEffect(() => {
    const imgElement = document.querySelector(".post-image");
    setOriginalWidth(imgElement.offsetWidth);
    setOriginalHeight(imgElement.offsetHeight);
    const handleScroll = () => {
      setNewLocation(newLocation);
      setSelectedImageType(selectedImageType);

      // Calculate the difference between the current scroll position and the initial position
      const scrollDifference = Math.abs(window.scrollY - initialScrollPosition);

      // If the user has scrolled a significant amount (greater than or equal to the threshold)
      // close the menus
      if (
        scrollDifference >= SCROLL_THRESHOLD &&
        (isMenuVisible || showExifData)
      ) {
        setIsMenuVisible(false);

        setShowExifData(false);
        setIsComments(false);
      }

      // Reset the initial scroll position
      initialScrollPosition = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    isMenuVisible,
    showExifData,
    description,
    newLocation,
    imageType,
    selectedImageType,
  ]);
  const handleDetailsClick = () => {
    setShowExifData(!showExifData);
    setIsMenuVisible(!isMenuVisible);
  };
  const handleDetailsClickSmallGrid = () => {
    toggleFullScreen();
  };
  const toggleFullScreen = () => {
    setIsMenuVisible(false);
    setIsFullScreen(!isFullScreen);
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuVisible(!isMenuVisible);
    setIsEditing(false);
    setIsEditingCategory(false);
  };
  const handleMouseLeave = () => {
    // Start the timer to close the menu after 2 seconds
    timerRef.current = setTimeout(() => {
      setIsMenuVisible(false);
    }, 1000);
  };

  const handleMouseEnter = () => {
    // If the menu is going to close due to the timer, clear the timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  const handleCommentsMenuClick = (event) => {
    setAnchorComments(event.currentTarget);
    setIsComments(!isComments);
  };
  const handleEditLocation = () => {
    setIsEditing(!isEditing);
  };
  const handleImageTypeChange = (event) => {
    setSelectedImageType(event.target.value);
  };
  const handleEditCategory = () => {
    setIsEditingCategory(!isEditingCategory);
    setIsEditing(false);
  };
  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/deletePost`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // Call the getUserPosts function to refetch the updated list of posts
        getPostsAll(dispatch);
        setIsMenuVisible(!isMenuVisible);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const patchLike = async () => {
    if (!loggedInUserId) {
      setSnackbarMessage("Log in if you want to add this image to favorites!");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      if (!response.ok) {
        // Handle other error cases if needed
        console.error("Error:", response.statusText);
        return;
      }

      const responseData = await response.json(); // Extract JSON data from response
      const { action } = responseData; // Access the action property from the extracted data

      console.log(action);

      if (action === "liked") {
        setSnackbarMessage("Image added to favorites!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Image removed from favorites!");
        setSnackbarSeverity("error");
      }

      setShowSnackbar(true);

      const updatedPost = responseData.updatedPost; // Access other properties if needed
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const patchSharable = async () => {
    // send a request to set isSharable to true
    const response = await fetch(`${BASE_URL}/posts/${postId}/share`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isSharable: true }),
    });
    setIsMenuVisible(!isMenuVisible);
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
  const patchSharableFalse = async () => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/removeShare`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isSharable: false }),
    });
    const updatedPost = await response.json();
    setIsMenuVisible(!isMenuVisible);
    dispatch(setPost({ post: updatedPost }));
    if (!regex.test(window.location.pathname)) {
      window.location.reload();
    }
  };
  const handleSaveLocation = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/editLocation`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: newLocation }),
      });
      console.log(response);
      if (response.ok) {
        // If the location is updated successfully on the server, update the description in the component state
        // Note: You may also want to handle the scenario where the update fails (e.g., show an error message).
        setIsEditing(false);
        setIsMenuVisible(false);
        setNewLocation(newLocation);
      } else {
        // Handle error scenario
        console.error("Failed to update location");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSaveImageType = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/editCategory`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageType: selectedImageType }),
      });
      console.log(response);
      if (response.ok) {
        // If the location is updated successfully on the server, update the description in the component state
        // Note: You may also want to handle the scenario where the update fails (e.g., show an error message).
        setIsEditingCategory(false);
        setSelectedImageType(selectedImageType);
        console.log(selectedImageType);
        setIsMenuVisible(false);
      } else {
        // Handle error scenario
        console.error("Failed to update location");
      }
    } catch (error) {
      console.log("errorororo");

      console.error(error);
    }
  };
  const handleSaveClick = () => {
    const url = `${BASE_URL}/assets/${picturePath}`;
    setIsMenuVisible(!isMenuVisible);

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", picturePath);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error(error));
  };

  return (
    <WidgetWrapper
      m={!isLargeGrid ? "0.5rem 0 0.5rem 0rem" : "0.2rem  0.4rem 0rem 0rem"}
      tag="gallery"
      // onMouseEnter={() => setShowIconButton(true)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* <UploadDetails
        style={{ position: "absolute", top: 0, left: 0 }}
        friendId={postUserId}
        name={name}
        subtitle={
          <>
            Shot on: {exifDataObject.Make} {exifDataObject.Model}
            <div style={{ lineHeight: "0.5", whiteSpace: "pre" }}>
              {"\n"}Lens:{" "}
              {exifDataObject.Make === "Canon"
                ? " EF" +
                  exifDataObject.FocalLength +
                  "mm f/" +
                  exifDataObject.FNumber
                : exifDataObject.undefined}
            </div>
          </>
        }
        userPicturePath={userPicturePath}
        onClick={() => navigate(`/profile/${loggedInUserId}`)}
      /> */}
      <div style={{ position: "relative" }}>
        <div
          className={isFullScreen ? "full-screen" : ""}
          onClick={toggleFullScreen}
        >
          <img
            className="post-image"
            width={isFullScreen ? originalWidth : "100%"}
            height={
              isNonMobileScreens
                ? isFullScreen
                  ? originalHeight
                  : !isLargeGrid
                  ? "350px"
                  : "150px"
                : isFullScreen
                ? originalHeight
                : !isLargeGrid
                ? "auto"
                : "250px"
            }
            alt="post"
            loading="lazy"
            style={{
              borderRadius: !isLargeGrid ? "0.75rem" : "0",
              opacity: showExifData ? "0.1" : "1",
              zIndex: 1,
            }}
            src={`${BASE_URL}/assets/${picturePath}`}
          />
          {/* {isFullScreen && isLargeGrid && (
            <div>
              <Typography
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  marginBottom: "2.5rem",
                  color: "white",
                  fontSize: "small",
                  fontWeight: "500",
                }}
                color={main}
                sx={{ ml: "0.5rem" }}
              >
                {description === "undefined" ? "" : description}
              </Typography>
              <List
                className="scrollbar"
                style={{
                  maxHeight: "90vh",
                  overflow: "auto",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  width: "100%",
                  color: "white",
                }}
              >
                <ListItem>
                  <ListItemText
                    primary="DominantColors Palette"
                    secondary={
                      <div
                        style={{
                          backgroundColor: !isNonMobileScreens
                            ? "rgba(0,0,0,0.5)"
                            : undefined,
                          padding: "0.3rem",
                          borderRadius: "0.5rem",
                          display: "block",
                        }}
                      >
                        {dominantColors.map((color, index) => (
                          <div
                            key={index}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div
                              style={{
                                width: "50px",
                                height: "50px",
                                backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                              }}
                            />
                            <span
                              style={{
                                marginLeft: "10px",
                                fontWeight: "bold",
                                color: "white",
                              }}
                            >
                              {`RGB[${index + 1}]: ${color.r} ${color.g} ${
                                color.b
                              }`}
                            </span>
                          </div>
                        ))}
                      </div>
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="f/"
                    secondary={exifDataObject.FNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Exposure Time"
                    secondary={"1/" + 1 / exifDataObject.ExposureTime}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="ISO"
                    secondary={exifDataObject.ISOSpeedRatings}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="FocalLength"
                    secondary={exifDataObject.FocalLength + "mm"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Make"
                    secondary={exifDataObject.Make}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Model"
                    secondary={exifDataObject.Model}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="DateTime"
                    secondary={exifDataObject.DateTimeOriginal}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="ExposureMode"
                    secondary={exifDataObject.ExposureMode}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Flash"
                    secondary={
                      exifDataObject.Flash ===
                      "Flash did not fire, compulsory flash mode"
                        ? "Off"
                        : "On"
                    }
                  />
                </ListItem>
              </List>
              <FlexBetween
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  marginBottom: "0.2rem",
                  color: "white",
                }}
              >
                <FlexBetween gap="0.1rem">
                  <FlexBetween>
                    <IconButton onClick={patchLike} style={{ color: "white" }}>
                      {isLiked ? (
                        <FavoriteOutlined sx={{ color: primary }} />
                      ) : (
                        <FavoriteBorderOutlined />
                      )}
                    </IconButton>
                    <Typography>{likeCount}</Typography>
                  </FlexBetween>

                  <FlexBetween gap="0.2rem">
                    <IconButton
                      onClick={handleCommentsMenuClick}
                      style={{ color: "white" }}
                    >
                      <ChatBubbleOutlineOutlined />
                    </IconButton>
                    <Typography m="0px 1rem 0 0">{comments.length}</Typography>
                  </FlexBetween>
                </FlexBetween>
              </FlexBetween>
            </div>
          )} */}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "13%",
            background: "rgba(0,0,0,0.6)",
          }}
        />

        {isSharable === true && (
          <Typography
            style={{ position: "absolute", top: 0, right: 3, color: "white" }}
            sx={{
              opacity: "0.4",
              textAlign: "right",
            }}
          >
            On feed
          </Typography>
        )}
        {showExifData && (
          <List
            className="scrollbar"
            style={{
              maxHeight: originalHeight,
              overflow: "auto",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
            }}
          >
            <ListItem>
              <ListItemText
                primary="Colors Palette"
                secondary={
                  <div
                    style={{
                      backgroundColor: !isNonMobileScreens
                        ? "rgba(0,0,0,0.5)"
                        : undefined,
                      padding: "0.3rem",
                      borderRadius: "0.5rem",
                      display: "block",
                    }}
                  >
                    {dominantColors.map((color, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <div
                          style={{
                            width: isLargeGrid
                              ? !isNonMobileScreens
                                ? "50px"
                                : "30px"
                              : !isNonMobileScreens
                              ? "50px"
                              : "30px",
                            height: isLargeGrid
                              ? !isNonMobileScreens
                                ? "50px"
                                : "30px"
                              : !isNonMobileScreens
                              ? "50px"
                              : "30px",
                            backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                          }}
                        />
                        <span
                          style={{
                            marginLeft: "10px",
                            fontWeight: isLargeGrid
                              ? !isNonMobileScreens
                                ? "bold"
                                : "undefined"
                              : !isNonMobileScreens
                              ? "bold"
                              : "undefine",
                            fontSize: isLargeGrid
                              ? !isNonMobileScreens
                                ? "0.8rem"
                                : "0.5rem"
                              : !isNonMobileScreens
                              ? "0.8rem"
                              : "0.5rem",
                            color: "white",
                          }}
                        >
                          {`[${index + 1}]: ${color.r} ${color.g} ${color.b}`}
                        </span>
                      </div>
                    ))}
                  </div>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="f/" secondary={exifDataObject.FNumber} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Exposure Time"
                secondary={"1/" + 1 / exifDataObject.ExposureTime}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="ISO"
                secondary={exifDataObject.ISOSpeedRatings}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="FocalLength"
                secondary={exifDataObject.FocalLength + "mm"}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Make" secondary={exifDataObject.Make} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Model" secondary={exifDataObject.Model} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="DateTime"
                secondary={exifDataObject.DateTimeOriginal}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="ExposureMode"
                secondary={exifDataObject.ExposureMode}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Flash"
                secondary={
                  exifDataObject.Flash ===
                  "Flash did not fire, compulsory flash mode"
                    ? "Off"
                    : "On"
                }
              />
            </ListItem>
          </List>
        )}

        <Box>
          <Typography
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              marginBottom: "2.5rem",
              color: "white",
              fontSize: !isLargeGrid ? "small" : "smaller",
              fontWeight: "500",
            }}
            color={main}
            sx={{ ml: "0.5rem" }}
          >
            {newLocation === "undefined" ? "" : newLocation}
          </Typography>
          <FlexBetween
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              marginBottom: "0.2rem",
              color: "white",
            }}
          >
            <FlexBetween gap="0.1rem">
              <FlexBetween>
                <IconButton onClick={patchLike} style={{ color: "white" }}>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: primary }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography>{likeCount}</Typography>
              </FlexBetween>

              <FlexBetween gap="0.2rem">
                <IconButton
                  onClick={handleCommentsMenuClick}
                  style={{ color: "white" }}
                >
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                <Typography m="0px 1rem 0 0">{comments.length}</Typography>
              </FlexBetween>
            </FlexBetween>
          </FlexBetween>
        </Box>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            marginBottom: "0.2rem",
          }}
        >
          <div style={{ fontSize: "10" }}>
            {showIconButton && isLargeGrid && (
              <IconButton onClick={handleMenuClick} style={{ color: "white" }}>
                <MoreVert />
              </IconButton>
            )}
            {!isLargeGrid && (
              <IconButton onClick={handleMenuClick} style={{ color: "white" }}>
                <MoreVert />
              </IconButton>
            )}
          </div>
          <Popper
            anchorEl={anchorEl}
            open={isMenuVisible}
            placement="top-start" // Set the placement of the menu relative to the anchor element
            disablePortal={true} // Prevent the menu from being rendered in a separate portal element
            style={{
              zIndex: "1",
              opacity: "1",
              backgroundColor: "rgba(0,0,0,0.5",
              cursor: "pointer",
            }}
          >
            <Paper>
              <List>
                {!isSharable && isAdmin && (
                  <ListItem onClick={patchSharable}>
                    <ListItemIcon>
                      <ShareOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Share on feed</ListItemText>
                  </ListItem>
                )}
                {isSharable && isAdmin && (
                  <ListItem onClick={patchSharableFalse}>
                    <ListItemIcon>
                      <RemoveCircleOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Remove from feed</ListItemText>
                  </ListItem>
                )}
                {isAdmin && (
                  <ListItem onClick={handleEditLocation}>
                    <ListItemIcon>
                      <EditLocationAltOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit location</ListItemText>
                  </ListItem>
                )}
                {isEditing && isAdmin && (
                  <div className="edit-location-container">
                    <input
                      type="text"
                      className="edit-location-input"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    />
                    <button
                      className="edit-location-button"
                      onClick={handleSaveLocation}
                    >
                      Save location
                    </button>
                  </div>
                )}
                {isAdmin && (
                  <ListItem onClick={handleEditCategory}>
                    <ListItemIcon>
                      <CategoryOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit category</ListItemText>
                  </ListItem>
                )}
                {isEditingCategory && isAdmin && (
                  <div className="edit-imageType-container">
                    <select
                      value={selectedImageType}
                      onChange={handleImageTypeChange}
                    >
                      <option value={imageType}>Current:{imageType}</option>{" "}
                      <option value="other">Other</option>
                      <option value="portrait">Portrait</option>
                      <option value="automotive">Automotive</option>
                      <option value="wildlife">Wildlife</option>
                      <option value="nature">Nature</option>
                      <option value="pets">Animals</option>
                      <option value="street_photography">
                        Street Photography
                      </option>
                    </select>

                    <button
                      className="edit-imageType-button"
                      onClick={handleSaveImageType}
                    >
                      Save
                    </button>
                  </div>
                )}
                {
                  <ListItem onClick={handleDetailsClick}>
                    <ListItemIcon>
                      <InfoOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Details</ListItemText>
                  </ListItem>
                }

                <ListItem onClick={handleSaveClick}>
                  <ListItemIcon>
                    <FileDownloadOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Save</ListItemText>
                </ListItem>
                {isAdmin && (
                  <ListItem
                    onClick={handleDeleteClick}
                    style={{ color: "red" }}
                  >
                    <ListItemIcon>
                      <DeleteOutline fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete photo</ListItemText>
                  </ListItem>
                )}

                <Divider />
              </List>
            </Paper>
          </Popper>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          marginBottom: "0.2rem",
        }}
      >
        <Popper
          anchorEl={anchorComments}
          open={isComments}
          placement="top-start" // Set the placement of the menu relative to the anchor element
          disablePortal={true} // Prevent the menu from being rendered in a separate portal element
          style={{
            zIndex: "1",
            opacity: "1",
            backgroundColor: "rgba(0,0,0,0.5",
            cursor: "pointer",
          }}
        >
          <Paper>
            {comments
              .slice()
              .reverse()
              .map((comment, i) => (
                <Box
                  padding="0.2rem 0.5rem"
                  display="flex"
                  maxWidth="250px"
                  key={`${name}-${i}`}
                >
                  <Typography
                    color={palette.primary.dark}
                    fontSize="0.7rem"
                    fontWeight="bold"
                  >
                    {"UserId:"}
                  </Typography>
                  <Typography fontSize="0.7rem" sx={{}} ml="0.3rem">
                    {comment}
                  </Typography>
                </Box>
              ))}
          </Paper>
        </Popper>
      </div>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={snackbarSeverity}
          onClose={handleCloseSnackbar}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </WidgetWrapper>
  );
};

export default PostWidget_Liked;
