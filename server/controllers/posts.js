import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPostInFeedFunc = async (req, res) => {
  try {
    const {
      userId,
      description,
      picturePath,
      isSharable,
      exifData,
      dominantColors,
      imageType,
    } = req.body;
    const user = await User.findById(userId);
    const newPostInfEED = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      cameraBody: user.cameraBody,
      cameraLens: user.cameraLens,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      isSharable: isSharable,
      comments: [],
      exifData,
      dominantColors,
      imageType,
    });
    await newPostInfEED.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getPostsFromFeedFunc = async (req, res) => {
  try {
    const post = await Post.find({ isSharable: true });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getLikedPostsByUserFunc = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find posts where the logged-in user has liked the image
    const likedPosts = await Post.find({
      [`likes.${userId}`]: true,
    });

    res.status(200).json(likedPosts);
  } catch (err) {
    console.log("Error on server side:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllPostsFunc = async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getPostsByUserFunc = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

export const likePostFromFeedFunc = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    let action = "";
    if (isLiked) {
      post.likes.delete(userId);
      action = "unliked";
    } else {
      post.likes.set(userId, true);
      action = "liked";
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json({ updatedPost, action });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const sharePostInFeedFunc = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { isSharable: true },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const removePostFromFeedFunc = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { isSharable: false },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const deletePostFunc = async (req, res) => {
  try {
    // Get the postId from the URL parameter
    const { id } = req.params;

    // Delete the post from the collection
    await Post.findByIdAndDelete(id);
    // Send a response to the client
    res.send({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const editLocationFunc = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    // Find the post by id and update the description field
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const editCategoryFunc = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageType } = req.body;

    // Find the post by id and update the imageType field
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { imageType },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
