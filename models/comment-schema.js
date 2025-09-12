import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prompt", // references the "Prompt" schema model, and gets the "ObjectId"
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
      maxlength: [200, "comment cannot be more than 200 characters."],
    },
  },
  { timestamps: true }
);

const commentModel =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default commentModel; // can use any variable name when importing the function elsewhere
