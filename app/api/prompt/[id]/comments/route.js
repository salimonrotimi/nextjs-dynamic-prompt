// This "route.js" file is in the file path /api/prompt/[id]/like
import connectToDB from "@utils/dbconnection";
import PromptSchemaModel from "@models/prompt-schema";
import CommentSchemaModel from "@models/comment-schema";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

// NOTE: "res" and "req.body" are not available in Next.js

// GET (total comments and if post is commented on by users)
export const GET = async(request, { params }) => {
    // the "params" argument is an object which has the "id" in the URL. The value is obtained with "params.id"
    const { id } = await params; // "id" is the folder name in your file i.e. [id]

    // This is the general GET api for comments, "session" is not required here.
    if (request.method !== "GET") {
        return NextResponse.json({
            success: false,
            error_message: "Method not allowed. Accept only GET request.",
        }, { status: 405 });
    }

    try {
        await connectToDB();

        // confirm that prompt "id" exist in the PromptSchemaModel before using it to check for likes
        const idExist = await PromptSchemaModel.findById(id);

        if (!idExist) {
            return NextResponse.json({
                success: false,
                error_message: "Post not found. Id does not exist.",
            }, { status: 404 });
        }

        // if the prompt "id" exist, count the total number of occurence for the "id" in the CommentSchemaModel
        const totalComments = await CommentSchemaModel.countDocuments({
            postId: id,
        });

        const result = await CommentSchemaModel.find({ postId: id })
            .populate(
                "postedBy", // path
                "username email image" // select
            )
            .sort({ createdAt: -1 }) // sort from the back to the front (i.e. from the most recent)
            .limit(50); // limit for performance

        return NextResponse.json({
            success: true,
            message: "Comments retrieved successfully.",
            totalComments,
            result,
        }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving comments...", error);
        return NextResponse.json({
            success: false,
            error_message: "Failed to retrieve comments.",
        }, { status: 500 });
    }
};

//POST
export const POST = async(request, { params }) => {
    const { id } = await params; // "id" is the folder name in your file i.e. [id]
    const session = await getServerSession(authOptions);
    const { commentText } = await request.json();

    if (request.method !== "POST") {
        return NextResponse.json({
            success: false,
            error_message: "Method not allowed. Accept only POST request.",
        }, { status: 405 });
    }

    if (!session) {
        return NextResponse.json({
            success: false,
            error_message: "Unauthorized. Kindly sign in to continue.",
        }, { status: 401 });
    }

    try {
        await connectToDB();
        // confirm that post or prompt "id" exist in the PromptSchemaModel before creating the comment
        const idExist = await PromptSchemaModel.findById(id);

        if (!idExist) {
            return NextResponse.json({
                success: false,
                error_message: "Post not found. Id does not exist.",
            }, { status: 404 });
        }

        // if the "comment" from the json requent is longer than 200 characters
        if (commentText.length > 200) {
            return NextResponse.json({
                success: false,
                error_message: "Comment too long (max 200 characters).",
            }, { status: 400 });
        }

        // Create comment for user if the post id exist
        const result = await CommentSchemaModel.create({
            postId: id,
            postedBy: session.user.id,
            comment: commentText.trim(),
        });

        // populate the "postedBy" field for future reference
        await result.populate("postedBy", "username email image");

        if (!result) {
            return NextResponse.json({
                success: false,
                error_message: "Could not create comment.",
            }, { status: 400 });
        }

        // Get the total likes after adding the new record
        const totalComments = await CommentSchemaModel.countDocuments({
            postId: id,
        });

        return NextResponse.json({
            success: true,
            message: "Comment added successfully.",
            totalComments,
            result,
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding comment...", error);
        return NextResponse.json({
            success: false,
            error_message: "Failed to add comment.",
        }, { status: 500 });
    }
};