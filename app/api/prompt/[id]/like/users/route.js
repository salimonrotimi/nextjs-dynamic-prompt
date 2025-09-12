// This "route.js" file is in the file path /api/prompt/[id]/like/users
import connectToDB from "@utils/dbconnection";
import PromptSchemaModel from "@models/prompt-schema";
import LikeSchemaModel from "@models/like-schema";
import { NextResponse } from "next/server";
import { maskEmail } from "@utils/mask-email";

// NOTE: "res" and "req.body" are not available in Next.js

// GET
export const GET = async (request, { params }) => {
  // the "params" argument is an object which has the "id" in the URL. The value is obtained with "params.id"
  const { id } = await params; // "id" is the folder name in your file i.e. [id]

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

    // if the prompt "id" exist, find the user that like the post with the given "id" in the LikeSchemaModel
    const result = await LikeSchemaModel.find({ postId: id })
      .populate({
        path: "likedBy",
        select: "username email image",
      })
      .sort({ createdAt: -1 }) // sort from the back to the front (i.e. from the most recent)
      .limit(50); // limit for performance

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Could not retrieve users that like the post.",
        },
        { status: 404 }
      );
    }

    result.forEach((dataItem) => {
      dataItem.likedBy.email = maskEmail(dataItem.likedBy.email);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully retrieved users that liked post.",
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving users that liked post...", error);

    return NextResponse.json(
      {
        success: false,
        error_message: "Failed to retrieve users that liked post.",
      },
      { status: 500 }
    );
  }
};
