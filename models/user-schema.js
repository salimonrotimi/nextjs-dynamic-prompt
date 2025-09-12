// This create the database schema or structure (a template for every user). It means the same as creating
// tables in mysql
import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        unique: [true, "Email already exist"],
        required: [true, "Email is required"],
        maxlength: [50, "Email length cannot be more than 50 characters."],
        match: [
            /^\w+([\.-_]?\w+)*@\w+([\.-_]?\w+)*(\.\w{2,3})+$/,
            "Email is not in the right format. Enter a valid email.",
        ],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        match: [
            /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
            "Username invalid. It should contain 3-20 alphanumeric characters",
        ],
    },
    image: {
        type: String,
    },
    provider: {
        type: String,
        required: [true, "Provider for authentiation is required"],
        enum: {
            values: ["github", "google"],
            message: "{VALUE} does not match any of the provider type: github, google.",
        },
    },
    providerId: {
        type: String,
    },
}, { timestamps: true });

// models.User checks if the "User" already exist in the models group and uses it if it already exist. If that
// is not the case, a new model is created for the User using model('User', userSchema). This prevent recompilation error
const userModel = models.User || model("User", userSchema);

export default userModel; // can use any variable name when importing the function elsewhere.