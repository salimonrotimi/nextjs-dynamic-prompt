import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prompt", // references the "Prompt" schema model, and gets the "ObjectId"
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

const likeModel = mongoose.models.Like || mongoose.model("Like", likeSchema);

export default likeModel; // can use any variable name when importing the function elsewhere