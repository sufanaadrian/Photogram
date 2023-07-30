import express from "express";
import {
  getPostsFromFeedFunc,
  getPostsByUserFunc,
  getAllPostsFunc,
  likePostFromFeedFunc,
  sharePostInFeedFunc,
  removePostFromFeedFunc,
  deletePostFunc,
  editLocationFunc,
} from "../controllers/posts.js";
import { verifyWithToken as verifyWithToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getPostsFromFeedFunc);
router.get("/:userId/posts", getPostsByUserFunc);
router.get("/all", getAllPostsFunc); // New route to fetch all posts

/* UPDATE */
router.patch("/:id/like", verifyWithToken, likePostFromFeedFunc);
router.patch("/:id/share", verifyWithToken, sharePostInFeedFunc);
router.patch("/:id/editLocation", verifyWithToken, editLocationFunc);
router.patch("/:id/removeShare", verifyWithToken, removePostFromFeedFunc);

/* DELETE */
router.delete("/:id/deletePost", verifyWithToken, deletePostFunc);

/* PDF GENERATOR */
export default router;
