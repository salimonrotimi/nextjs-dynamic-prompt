// This "route.js" file is for the "prompt" folder. The path is /api/prompt
import connectToDB from "@utils/dbconnection";
import PromptSchemaModel from "@models/prompt-schema";
import { NextResponse } from "next/server";
import { sanitizeHTML } from "@utils/input-sanitizer";
import { maskEmail } from "@utils/mask-email";

// NOTE: "res" and "req.body" are not available in Next.js

export const GET = async (request) => {
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

    const result = await PromptSchemaModel.find({}).populate({
      path: "creator",
      select: "username email image",
      model: "User",
    }); // .populate("creator", "username email image");   // This also works. "model" is optional as above

    // .populate() uses the users ObjectId stored in "creator" to fill the creator field with the user details

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Could not retrieve posts.",
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
    console.error("Error retrieving posts...", error);

    return NextResponse.json(
      {
        success: false,
        error_message: "Failed to retrieve posts.",
      },
      { status: 500 }
    );
  }
};