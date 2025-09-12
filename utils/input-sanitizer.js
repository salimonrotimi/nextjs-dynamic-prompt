import DOMPurify from "isomorphic-dompurify"; // import with any name. The "isomorphic-dompurify" package
// works for both client and server unlike "dompurify" which works for only client and does not work for
// Next.js due to its dependency "jsdom" error.
import validator from "validator";

// HTML Sanitization (for "post" and "tag")
export const sanitizeHTML = (dirtyInput) => {
    if (typeof dirtyInput !== "string") {
        return dirtyInput;
    }
    // Sanitization allowing some tags and attributes. Encoding are handled automatically in the process.
    return DOMPurify.sanitize(dirtyInput, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
        ALLOWED_ATTR: ["href", "target", "style"],
    });
};

// Input Validation (for OAuth input). It slows down the performance of OAuth, so it is not used.
export const sanitizeInput = {
    email: (email) => {
        if (!email || typeof email !== "string") {
            return null;
        }
        const sanitized = email.trim();
        return validator.isEmail(sanitized) ? sanitized : null;
    },

    username: (username) => {
        if (!username || typeof username !== "string") {
            return null;
        }
        const sanitized = username.trim();
        // returned "sanitized" values with length 3-20 and is alphanumeric (i.e. contains letters and numbers)
        // and also accept underscore and dash i.e. "_-"
        return validator.isLength(sanitized, { min: 3, max: 30 }) &&
            validator.isAlphanumeric(sanitized, "en-US", { ignore: "_-" }) ?
            sanitized :
            null;
    },

    url: (url) => {
        if (!url || typeof url !== "string") {
            return null;
        }
        const sanitized = url.trim();
        return validator.isURL(sanitized) ? sanitized : null;
    },
};