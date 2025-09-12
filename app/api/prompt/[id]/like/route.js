// This "route.js" file is in the file path /api/prompt/[id]/like
import connectToDB from "@utils/dbconnection";
import PromptSchemaModel from "@models/prompt-schema";
import LikeSchemaModel from "@models/like-schema";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

// NOTE: "res" and "req.body" are not available in Next.js

// GET (total likes and if post is liked by user)
export const GET = async (request, { params }) => {
  // the "params" argument is an object which has the "id" in the URL. The value is obtained with "params.id"
  const { id } = await params; // "id" is the folder name in your file i.e. [id]
  const session = await getServerSession(authOptions);

  // This is the general GET api, "session" is not required here.
  if (request.method !== "GET") {
    return NextResponse.json(
      {
        success: false,
        error_message: "Method not allowed. Accept only GET request.",
      },
      { status: 405 }
    );
  }

  try {
    await connectToDB();

    // confirm that prompt "id" exist in the PromptSchemaModel before using it to check for likes
    const idExist = await PromptSchemaModel.findById(id);

    if (!idExist) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Post not found. Id does not exist.",
        },
        { status: 404 }
      );
    }

    // if the prompt "id" exist, count the total number of occurence for the "id" in the LikeSchemaModel
    const totalLikes = await LikeSchemaModel.countDocuments({ postId: id });

    // Check if the current session user has liked the post in the LikeSchemaModel before
    let isLikedByUser = false;

    if (session) {
      const userLike = await LikeSchemaModel.findOne({
        postId: id,
        likedBy: session.user.id,
      });
      isLikedByUser = !!userLike; // convert is userLike which is object to a "boolean" (i.e. true)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post likes retrieved successfully.",
        totalLikes,
        isLikedByUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving post likes...", error);

    return NextResponse.json(
      {
        success: false,
        error_message: "Failed to retrieve post likes.",
      },
      { status: 500 }
    );
  }
};

//POST
export const POST = async (request, { params }) => {
  const { id } = await params; // "id" is the folder name in your file i.e. [id]
  const session = await getServerSession(authOptions);

  if (request.method !== "POST") {
    return NextResponse.json(
      {
        success: false,
        error_message: "Method not allowed. Accept only POST request.",
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
    // confirm that prompt "id"  exist in the PromptSchemaModel before using it to check for likes
    const idExist = await PromptSchemaModel.findById(id);

    if (!idExist) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Post not found. Id does not exist.",
        },
        { status: 404 }
      );
    }

    // Check if the current session user had already liked the post in the LikeSchemaModel before
    const likeExist = await LikeSchemaModel.findOne({
      postId: id,
      likedBy: session.user.id,
    });

    if (likeExist) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Post already liked by user.",
        },
        { status: 400 }
      );
    }

    // Create new like for user if there is no existing one
    const result = await LikeSchemaModel.create({
      postId: id,
      likedBy: session.user.id,
    });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Could not like post.",
        },
        { status: 400 }
      );
    }

    // Get the total likes after adding the new record
    const totalLikes = await LikeSchemaModel.countDocuments({ postId: id });

    return NextResponse.json(
      {
        success: true,
        message: "Post liked successfully.",
        totalLikes,
        isLikedByUser: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error liking post...", error);

    return NextResponse.json(
      {
        success: false,
        error_message: "Failed to like post.",
      },
      { status: 500 }
    );
  }
};
