import validator from "validator";

// Validation (for user form input)
export const validateUser = (userData) => {
    const errors = {};

    // Email validation
    if (!userData.email) {
        errors.email = "Email is required";
    } else if (!validator.isEmail(userData.email)) {
        errors.email = "Invalid email format";
    }

    // Username validation
    if (!userData.username) {
        errors.username = "Username is required";
    } else if (!validator.isLength(userData.username, { min: 3, max: 20 })) {
        errors.username = "Username must be between 3 and 20 characters";
    } else if (!validator.isAlphanumeric(userData.username, "en-US", { ignore: "_-" })) {
        errors.username =
            "Username can only contain letters, numbers, underscores, and hyphens";
    }

    // Image URL validation (optional)
    if (userData.image && !validator.isURL(userData.image)) {
        errors.image = "Invalid image URL";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validatePost = (postData) => {
    const errors = {};

    // Prompt validation
    if (!postData.prompt) {
        errors.prompt = "Prompt is required";
    } else if (!validator.isLength(postData.prompt, { min: 2, max: 100 })) {
        errors.prompt = "Prompt must be between 2 and 100 characters.";
    }

    // Tag validation
    if (!postData.tag) {
        errors.tag = "Tag is required";
    } else if (!validator.isLength(postData.tag, { min: 2, max: 15 })) {
        errors.tag = "Tag must be between 2 and 15 characters.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};