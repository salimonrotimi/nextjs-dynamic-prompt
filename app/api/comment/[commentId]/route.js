// This "route.js" file is in the file path /api/prompt/[id]/like
import connectToDB from "@utils/dbconnection";
import CommentSchemaModel from "@models/comment-schema";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

//PUT
export const PUT = async (request, { params }) => {
  const { commentId } = await params; // "commentId" is the folder name in your file i.e. [commentId]
  const session = await getServerSession(authOptions);
  const { commentText } = await request.json();

  if (request.method !== "PUT") {
    return NextResponse.json(
      {
        success: false,
        error_message: "Method not allowed. Accept only PUT request.",
      },
      { status: 405 }
    );
  }

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error_message: "Unauthorized. Kindly sign in to continue.",
      },
      { status: 401 }
    );
  }

  try {
    await connectToDB();
    // confirm that post or prompt "id" exist in the PromptSchemaModel before creating the comment
    const commentExist = await CommentSchemaModel.findById(commentId);

    if (!commentExist) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Comment not found. Id does not exist.",
        },
        { status: 404 }
      );
    }

    // if the "comment" from the json requent is longer than 200 characters
    if (commentText.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Comment too long (max 200 characters).",
        },
        { status: 400 }
      );
    }

    // check if the user id (under "postedBy" field) is equal to the user session id i.e. same person
    if (commentExist.postedBy._id.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Forbidden. You can only edit your own comment.",
        },
        { status: 403 }
      );
    }

    // Update the comment (from the json request) for user if the comment id exist
    commentExist.comment = commentText.trim();
    commentExist.updatedAt = new Date();

    const result = await commentExist.save(); // "result" contains all the fields and the updated ones

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Could not edit comment.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment edited successfully.",
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error editing comment...", error);
    return NextResponse.json(
      {
        success: false,
        error_message: "Failed to edit comment.",
      },
      { status: 500 }
    );
  }
};

//DELETE
export const DELETE = async (request, { params }) => {
  const { commentId } = await params; // "commentId" is the folder name in your file i.e. [commentId]
  const session = await getServerSession(authOptions);

  if (request.method !== "DELETE") {
    return NextResponse.json(
      {
        success: false,
        error_message: "Method not allowed. Accept only DELETE request.",
      },
      { status: 405 }
    );
  }

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error_message: "Unauthorized. Kindly sign in to continue.",
      },
      { status: 401 }
    );
  }

  try {
    await connectToDB();
    // confirm that post or prompt "id" exist in the PromptSchemaModel before creating the comment
    const commentExist = await CommentSchemaModel.findById(commentId);

    if (!commentExist) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Comment not found. Id does not exist.",
        },
        { status: 404 }
      );
    }

    // check if the user id (under "postedBy" field) is equal to the user session id i.e. same person
    if (commentExist.postedBy._id.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Forbidden. You can only delete your own comment.",
        },
        { status: 403 }
      );
    }

    // Delete the comment if the comment id exist
    const result = await CommentSchemaModel.findOneAndDelete({
      _id: commentId,
    });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Could not delete comment.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment deleted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error deleting comment...", error);
    return NextResponse.json(
      {
        success: false,
        error_message: "Failed to delete comment.",
      },
      { status: 500 }
    );
  }
};
