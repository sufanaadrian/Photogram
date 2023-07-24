import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import PostsWidgetOnlyShared from "scenes/widgets/PostsWidgetOnlyShared"; // Import the PostsWidgetSharedOnly component
const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        mt={isNonMobileScreens ? "0rem" : undefined}
      >
        <Box flexBasis="25%" padding={isNonMobileScreens ? "2rem 2%" : "1rem"}>
          <AdvertWidget />
          <Box m="2rem 0" />
        </Box>
        <Box
          padding={isNonMobileScreens ? "2.5rem 1%" : "0rem"}
          flexBasis={isNonMobileScreens ? "70%" : "50%"}
          width={isNonMobileScreens ? undefined : "100%"}
          ml={isNonMobileScreens ? undefined : "1rem"}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <PostsWidgetOnlyShared />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
