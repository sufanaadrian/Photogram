import { Box, useMediaQuery, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import { useState } from "react";
import SortMenu from "scenes/widgets/SortMenu";
import PostsWidgetOnlyLiked from "scenes/widgets/PostsWidgetOnlyLiked"; // Import the PostsWidgetSharedOnly component

const LikedImgPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [sortCriteria, setSortCriteria] = useState("all");
  const [filterCriteria, setFilterCriteria] = useState("all");
  const [colorCriteria, setColorCriteria] = useState("all");
  const [xl, setXl] = useState(1);

  return (
    <Box>
      <Box className="sticky-navbar">
        <Navbar />
      </Box>
      <Box
        width="100%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        mt={isNonMobileScreens ? "0rem" : undefined}
      >
        <Box pb="2rem" />

        <Box>
          <Typography className="word">
            <span>F</span>
            <span>A</span>
            <span>V</span>
            <span>O</span>
            <span>R</span>
            <span>I</span>
            <span>T</span>
            <span>E</span>
            <span>S</span>
          </Typography>
        </Box>
        <Box pb="2rem" />

        <Box
          // padding={isNonMobileScreens ? "2.5rem 1%" : "0rem"}
          flexBasis={isNonMobileScreens ? "70%" : "50%"}
          width={isNonMobileScreens ? undefined : "100%"}
          // ml={isNonMobileScreens ? undefined : "1rem"}
          mt={isNonMobileScreens ? "2.5rem" : "0rem"}
        >
          <Box mb="1rem">
            <SortMenu
              onSortCriteriaChange={setSortCriteria}
              onFilterCriteriaChange={setFilterCriteria}
              onColorCriteriaChange={setColorCriteria}
              onXLChange={setXl}
            />
          </Box>
          <Box>
            <PostsWidgetOnlyLiked
              sortCriteria={sortCriteria}
              filterCriteria={filterCriteria}
              colorCriteria={colorCriteria}
              xl={xl}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LikedImgPage;
