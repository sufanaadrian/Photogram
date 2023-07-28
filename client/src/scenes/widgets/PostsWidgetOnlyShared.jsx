/* eslint-disable react/jsx-pascal-case */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostWidget_Highlights from "./PostWidget_Highlights";
import { Container, Row, Col } from "react-grid-system";
import { Pagination } from "@mui/material";
import { getPosts, getUserPosts, getPostsAll } from "components/api";

const PostsWidgetOnlyShared = ({
  sortCriteria,
  filterCriteria,
  colorCriteria,
  xl,
}) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [page, setPage] = useState(1);
  let postsPerPage;
  let isLargeGrid;

  if (xl === 2) {
    postsPerPage = 12;
    isLargeGrid = false;
  } else {
    postsPerPage = 1000;
    isLargeGrid = true;
  }
  function hexToRgb(hex) {
    const hexCode = hex.replace("#", "");
    const r = parseInt(hexCode.substr(0, 2), 16);
    const g = parseInt(hexCode.substr(2, 2), 16);
    const b = parseInt(hexCode.substr(4, 2), 16);
    return [r, g, b];
  }
  function isColorInRange(color, range) {
    const [rMin, rMax, gMin, gMax, bMin, bMax] = range;
    const [r, g, b] = color.split(",");
    return (
      r >= rMin && r <= rMax && g >= gMin && g <= gMax && b >= bMin && b <= bMax
    );
  }

  // Add this code block to define the color range from the colorCriteria prop
  const colorRange = colorCriteria ? hexToRgb(colorCriteria) : null;

  const colorRangeWithThreshold = colorRange
    ? [
        Math.max(colorRange[0] - colorRange[0] * 0.3, 0),
        Math.min(colorRange[0] + colorRange[0] * 0.3, 255),
        Math.max(colorRange[1] - colorRange[1] * 0.3, 0),
        Math.min(colorRange[1] + colorRange[1] * 0.3, 255),
        Math.max(colorRange[2] - colorRange[2] * 0.3, 0),
        Math.min(colorRange[2] + colorRange[2] * 0.3, 255),
      ]
    : null;

  useEffect(() => {
    getPosts(dispatch);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const sortedPostsFeed = Array.isArray(posts)
    ? [...posts].sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      })
    : [];

  const filteredAndSortedPosts = Array.isArray(posts)
    ? [...posts]
        .map((post) => ({
          ...post,
          exifDataObject: JSON.parse(post.exifData),
        }))
        .sort((a, b) => {
          switch (sortCriteria) {
            case "dateUp":
              return a.createdAt > b.createdAt ? -1 : 1;
            case "dateDown":
              return a.createdAt < b.createdAt ? -1 : 1;
            case "likes":
              const aLikesCount = Object.keys(a.likes).length;
              const bLikesCount = Object.keys(b.likes).length;
              return bLikesCount - aLikesCount;
            default:
              return a.createdAt > b.createdAt ? -1 : 1;
          }
        })
        .filter((post) => {
          if (!filterCriteria) return post;
          if (filterCriteria === "showAll") return post;
          if (filterCriteria === "isOnFeed") return post.isSharable;
          if (filterCriteria.startsWith("f/")) {
            const [, value] = filterCriteria.split("/");
            return post.exifDataObject.FNumber === Number(value.trim());
          }
          if (filterCriteria.startsWith("ISO:")) {
            const [, value] = filterCriteria.split(":");
            return post.exifDataObject.ISOSpeedRatings === Number(value.trim());
          }
          if (filterCriteria.startsWith("1/")) {
            const [, value] = filterCriteria.split("/");
            return post.exifDataObject.ExposureTime === Number(value.trim());
          }
          if (filterCriteria.startsWith("mm")) {
            const [, value] = filterCriteria.split(":");
            return post.exifDataObject.FocalLength === Number(value.trim());
          }
          if (filterCriteria.startsWith("make")) {
            const [, value] = filterCriteria.split(":");
            return post.exifDataObject.Make === value.trim();
          }
          if (filterCriteria.startsWith("model")) {
            const [, value] = filterCriteria.split(":");
            return post.exifDataObject.Model === value.trim();
          }
          if (filterCriteria.startsWith("date")) {
            const [, value] = filterCriteria.split("=");
            return post.exifDataObject.DateTimeOriginal.startsWith(
              value.trim()
            );
          }
          if (colorCriteria !== "all") {
            const dominantColors = post.dominantColors;
            let colorInRange = false;

            for (let i = 0; i < dominantColors.length; i++) {
              const color = `${dominantColors[i].r},${dominantColors[i].g},${dominantColors[i].b}`;
              colorInRange = isColorInRange(color, colorRangeWithThreshold);
              if (colorInRange) {
                break; // Exit the loop if a color is found within range
              }
            }
            if (colorInRange) {
              return post;
            } else {
              return null;
            }
          } else {
            return post;
          }
        })
    : [];
  const paginatedPosts = filteredAndSortedPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  return (
    <>
      <Container>
        <Row style={{ width: "100%" }}>
          {filteredAndSortedPosts.map(
            ({
              _id,
              userId,
              firstName,
              lastName,
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
              dominantColors,
            }) => (
              <Col
                key={_id}
                xs={xl !== 2 ? 12 : 6}
                sm={xl !== 2 ? 6 : 6}
                md={xl !== 2 ? 6 : 6}
                lg={xl !== 2 ? 5 : 6}
                xl={xl !== 2 ? 4 : 6}
              >
                <PostWidget_Highlights
                  postId={_id}
                  postUserId={userId}
                  name={`${firstName} ${lastName}`}
                  description={description}
                  cameraBody={cameraBody}
                  cameraLens={cameraLens}
                  location={location}
                  picturePath={picturePath}
                  userPicturePath={userPicturePath}
                  likes={likes}
                  isSharable={isSharable}
                  comments={comments}
                  exifData={exifData}
                  isLargeGrid={isLargeGrid}
                  dominantColors={dominantColors}
                />
              </Col>
            )
          )}
        </Row>
      </Container>
    </>
  );
};
export default PostsWidgetOnlyShared;
