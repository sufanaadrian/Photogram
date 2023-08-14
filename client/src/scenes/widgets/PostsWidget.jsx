import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostWidget from "./PostWidget";
import { Container, Row, Col } from "react-grid-system";
import { Pagination } from "@mui/material";
import { getPosts, getUserPosts, getPostsAll } from "components/api";

const PostsWidget = ({ sortCriteria, filterCriteria, colorCriteria, xl }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const regex = /\/all/; // Update the regex to check for "/all" page
  const [page, setPage] = useState(1);
  const loggedInUserId = useSelector((state) =>
    state.user ? state.user : "standard"
  );
  let postsPerPage;
  let isLargeGrid;
  let isProfile;
  if (xl === 2) {
    postsPerPage = 12;
    isLargeGrid = false;
    console.log(loggedInUserId.role);
  } else {
    postsPerPage = 1000;
    isLargeGrid = true;
  }
  if (regex.test(window.location.pathname)) isProfile = true;
  else isProfile = false;
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
    if (regex.test(window.location.pathname)) {
      getPostsAll(dispatch);
    } else {
      getPosts(dispatch);
    }
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
          if (filterCriteria.startsWith("imageType:")) {
            const [, value] = filterCriteria.split(":");
            return post.imageType === value.trim();
          }
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
            const makeFilter = value.trim().toLowerCase();
            const makeExif =
              post.exifDataObject && post.exifDataObject.Make
                ? post.exifDataObject.Make.toLowerCase()
                : "";
            return makeExif.includes(makeFilter);
          }
          if (filterCriteria.startsWith("model")) {
            const [, value] = filterCriteria.split(":");
            const modelFilter = value.trim().toLowerCase();
            const modelExif =
              post.exifDataObject && post.exifDataObject.Model
                ? post.exifDataObject.Model.toLowerCase()
                : ""; // If Model is undefined, set an empty string

            return modelExif.includes(modelFilter);
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
      {/* <div
        style={{
          fontSize: "12px",
          fontFamily: "sans-serif",
          textAlign: "right",
          margin: "0px 15px",
        }}
      >
        Posts: {filteredAndSortedPosts.length}
      </div> */}
      <Container>
        <Row gutterWidth={isLargeGrid ? 0 : undefined}>
          {paginatedPosts.map(
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
              filterCriteria,
              imageType,
            }) => (
              <Col
                key={_id}
                xs={xl === 2 ? 12 : 3}
                sm={xl === 2 ? 6 : 3}
                md={xl === 2 ? 3 : 2}
                lg={xl === 2 ? 3 : xl}
                xl={xl === 2 ? xl : 0.8}
              >
                <PostWidget
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
                  isProfile={isProfile}
                  dominantColors={dominantColors}
                  imageType={imageType}
                  role={loggedInUserId.role}
                />
              </Col>
            )
          )}
        </Row>
        {xl === 2 && (
          <Row justify="center" style={{ margin: "1rem" }}>
            <Pagination
              count={Math.ceil(posts.length / postsPerPage)}
              page={page}
              onChange={(event, newPage) => {
                setPage(newPage);
                window.scrollTo(0, 0);
              }}
              style={{ position: "fixed", bottom: 0, marginBottom: "1rem" }}
            />
          </Row>
        )}
      </Container>
    </>
  );
};
export default PostsWidget;
