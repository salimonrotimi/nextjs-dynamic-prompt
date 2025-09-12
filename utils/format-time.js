export const formatCreatedTime = (dateCreated) => {
    const now = new Date();
    const creationDate = new Date(dateCreated);
    const timeDiffSeconds = Math.floor((now - creationDate) / 1000);

    if (timeDiffSeconds < 60) {
        return "just now";
    }

    if (timeDiffSeconds < 3600) {
        const result = Math.floor(timeDiffSeconds / 60);
        return result > 1 ?
            result.toString() + " mins ago" :
            result.toString() + " min ago";
    }

    if (timeDiffSeconds < 86400) {
        const result = Math.floor(timeDiffSeconds / 3600);
        return result > 1 ?
            result.toString() + " hrs ago" :
            result.toString() + " hr ago";
    }

    if (timeDiffSeconds > 86400) {
        const result = Math.floor(timeDiffSeconds / 86400);
        return result > 1 ?
            result.toString() + " days ago" :
            result.toString() + " day ago";
    }
};