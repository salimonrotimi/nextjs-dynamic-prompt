// This "route.js" file is for the "user" folder. The path is /api/user/[id]/posts
import connectToDB from "@utils/dbconnection";
import PromptSchemaModel from "@models/prompt-schema";
import { NextResponse } from "next/server";
import { sanitizeHTML } from "@utils/input-sanitizer";
import { maskEmail } from "@utils/mask-email";

// NOTE: "res" and "req.body" are not available in Next.js

export const GET = async (request, { params }) => {
  // the "params" argument is an object which has the "id" in the URL. The value is obtained with "params.id"
  const { id } = await params; // "id" is the folder name in your file i.e. [id]

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

    const result = await PromptSchemaModel.find({ creator: id })
      .populate({
        path: "creator",
        select: "username email image",
        model: "User", // OR .populate("creator", "username email image");
      })
      .sort({ createdAt: -1 });

    // .populate() uses the users ObjectId stored in "creator" to fill the creator field with the user details

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Could not retrieve prompt",
        },
        { status: 400 }
      );
    }

    // sanitize the data retrieved from the database
    result.forEach((item) => {
      item.creator.email = maskEmail(item.creator.email);
      item.prompt = sanitizeHTML(item.prompt);
      item.tag = sanitizeHTML(item.tag);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Prompt retrieved successfully.",
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving prompt...", error);

    return NextResponse.json(
      {
        success: false,
        error_message: "Failed to retrieve prompt.",
      },
      { status: 500 }
    );
  }
};