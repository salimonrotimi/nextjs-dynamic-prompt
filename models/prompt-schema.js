import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // references the "User" schema model, and gets the "ObjectId"
    },
    prompt: {
        type: String,
        required: [true, "Prompt is required."],
        maxlength: [200, "comment cannot be more than 200 characters."]
    },
    tag: {
        type: String,
        required: [true, "Tag is required"],
    },
}, { timestamps: true });

const promptModel =
    mongoose.models.Prompt || mongoose.model("Prompt", promptSchema);

export default promptModel; // can use any variable name when importing the function elsewhere.