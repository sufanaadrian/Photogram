import { Box, Typography, useMediaQuery } from "@mui/material";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import SortMenu from "scenes/widgets/SortMenu";
import PhotoUploadWidget from "scenes/widgets/PhotoUploadWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import BASE_URL from "../../config"; // Import the BASE_URL
const ProfilePage = () => {
  const [user, setUser] = useState(null); // Initialize as undefined
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const userIdCoded = "64bc0534c39d385c73c1310b"; // Hardcoded userId  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  const loggedInUserId = useSelector((state) => state.user ?? null);
  const loggedInUser = useSelector((state) => state.user ?? "standard");
  const isAdmin = loggedInUser.role === "admin";
  const [sortCriteria, setSortCriteria] = useState("all");
  const [filterCriteria, setFilterCriteria] = useState("all");
  const [colorCriteria, setColorCriteria] = useState("all");
  const [xl, setXl] = useState(1);
  const getUser = async () => {
    const response = await fetch(`${BASE_URL}/users/${userIdCoded}`);
    const data = await response.json();
    setUser(data);
  };
  useEffect(() => {
    getUser();
  }, []);
  const spans = document.querySelectorAll(".word span");

  spans.forEach((span, idx) => {
    span.addEventListener("click", (e) => {
      e.target.classList.add("active");
    });

    span.addEventListener("animationend", (e) => {
      e.target.classList.remove("active");
    });

    // Initial animation
    setTimeout(() => {
      span.classList.add("active");
    }, 750 * (idx + 1));
  });

  return (
    <Box>
      <Box className="sticky-navbar">
        <Navbar />
      </Box>
      <Box
        width="100%"
        padding={isNonMobileScreens ? "0%" : "2%"}
        display={isNonMobileScreens ? "flex" : "block"}
        gap="3rem"
        mt={isNonMobileScreens ? "0.5rem" : "1rem"}
      >
        <Box m="1rem">
          <Box>
            <Typography className="word">
              <span>G</span>
              <span>A</span>
              <span>L</span>
              <span>L</span>
              <span>E</span>
              <span>R</span>
              <span>Y</span>
            </Typography>
          </Box>
          <Box pb="1rem" />

          <div className="sticky">
            {isAdmin && <PhotoUploadWidget userId={loggedInUserId} />}{" "}
            <Box mb="1rem" />
            <UserWidget
              userId={userIdCoded}
              picturePath={user !== null ? user.picturePath : null}
            />
            <Box mb="2rem" />
          </div>
        </Box>
        <Box
          ml={xl === 2 ? (isNonMobileScreens ? undefined : "1rem") : undefined}
          width={
            xl === 2 ? (isNonMobileScreens ? undefined : "100%") : undefined
          }
        >
          <SortMenu
            onSortCriteriaChange={setSortCriteria}
            onFilterCriteriaChange={setFilterCriteria}
            onColorCriteriaChange={setColorCriteria}
            onXLChange={setXl}
          />

          <PostsWidget
            sortCriteria={sortCriteria}
            filterCriteria={filterCriteria}
            colorCriteria={colorCriteria}
            xl={xl}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
