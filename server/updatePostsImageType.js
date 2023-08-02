// updatePostsImageType.js

import mongoose from "mongoose";
import Post from "./models/Post.js";
const updatePostsImageType = async () => {
  try {
    await mongoose.connect(
      "mongodb://adriansuf:veverita00@ac-eeqqjyo-shard-00-00.dxo6ilb.mongodb.net:27017,ac-eeqqjyo-shard-00-01.dxo6ilb.mongodb.net:27017,ac-eeqqjyo-shard-00-02.dxo6ilb.mongodb.net:27017/?ssl=true&replicaSet=atlas-has0yg-shard-0&authSource=admin&retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const postsWithoutImageType = await Post.find({
      imageType: { $exists: false },
    });

    // Iterate through each post without the imageType field and set the imageType based on some logic
    for (const post of postsWithoutImageType) {
      // Example: Set the imageType based on the dominantColors field

      post.imageType = "other";

      // Save the updated post
      await post.save();
    }

    console.log("Successfully updated imageType for existing posts.");
  } catch (error) {
    console.error("Error updating imageType:", error);
  } finally {
    // Close the database connection after updating
    mongoose.connection.close();
  }
};

// Call the function to start the update process
updatePostsImageType();
