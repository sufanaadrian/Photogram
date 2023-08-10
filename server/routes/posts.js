import express from "express";
import {
  getPostsFromFeedFunc,
  getPostsByUserFunc,
  getLikedPostsByUserFunc,
  getAllPostsFunc,
  likePostFromFeedFunc,
  sharePostInFeedFunc,
  removePostFromFeedFunc,
  deletePostFunc,
  editLocationFunc,
  editCategoryFunc,
} from "../controllers/posts.js";
import { verifyWithToken as verifyWithToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getPostsFromFeedFunc);
router.get("/:userId/posts", getPostsByUserFunc);
router.get("/all", getAllPostsFunc); // New route to fetch all posts
router.get("/:userId/liked-images", getLikedPostsByUserFunc);
/* UPDATE */
router.patch("/:id/like", likePostFromFeedFunc);
router.patch("/:id/share", verifyWithToken, sharePostInFeedFunc);
router.patch("/:id/editLocation", verifyWithToken, editLocationFunc);
router.patch("/:id/editCategory", verifyWithToken, editCategoryFunc);
router.patch("/:id/removeShare", verifyWithToken, removePostFromFeedFunc);

/* DELETE */
router.delete("/:id/deletePost", verifyWithToken, deletePostFunc);

/* PDF GENERATOR */
export default router;
