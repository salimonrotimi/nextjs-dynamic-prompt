// This "route.js" file is for the "prompt" folder. The path is /api/prompt/[id]
import connectToDB from "@utils/dbconnection";
import PromptSchemaModel from "@models/prompt-schema";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { sanitizeHTML } from "@utils/input-sanitizer";

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

    const result = await PromptSchemaModel.findById(id).populate({
      path: "creator",
      select: "username email image",
      model: "User",
    });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Post not found.",
        },
        { status: 404 }
      );
    }

    // sanitize retrieved data. "result" is a single data so "result.forEach()" is not needed with it
    const sanitizePrompt = sanitizeHTML(result.prompt);
    const sanitizeTag = sanitizeHTML(result.tag);
    // update the "prompt" and "tag" field with the sanitized data
    result.prompt = sanitizePrompt;
    result.tag = sanitizeTag;

    return NextResponse.json(
      {
        success: true,
        message: "Post retrieved successfully.",
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving post...", error);

    return NextResponse.json(
      {
        success: false,
        error_message: "Failed to retrieve post.",
      },
      { status: 500 }
    );
  }
};

// PUT
export const PUT = async (request, { params }) => {
  // the "params" argument is an object which has the "id" in the URL. The value is obtained with "params.id"
  const { id } = await params;
  const session = await getServerSession(authOptions);

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
    // first get the "content-type" in order to know how to handle the client data
    const contentType = request.headers.get("content-type");
    let clientData;

    if (contentType.includes("application/json")) {
      clientData = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      clientData = {
        prompt: formData.get("prompt"),
        tag: formData.get("tag"),
      };
    } else {
      // for content type "application/x-www-form-urlencoded"
      const formData = await request.formData();
      clientData = Object.fromEntries(formData.entries());
    }

    const { prompt, tag } = clientData; // destructure the client data

    if (!prompt || !tag) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Bad Request. Prompt and tag cannot be empty.",
        },
        { status: 400 }
      );
    }

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

    const result = await PromptSchemaModel.findOneAndUpdate(
      { _id: id },
      { prompt, tag }
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Could not update post",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post updated successfully.",
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post...", error);

    return NextResponse.json(
      {
        success: false,
        error_message: "Failed to update post.",
      },
      { status: 500 }
    );
  }
};

// DELETE
export const DELETE = async (request, { params }) => {
  // the "params" argument is an object which has the "id" in the URL. The value is obtained with "params.id"
  const { id } = await params;
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

    const idExist = await PromptSchemaModel.findById(id);

    if (!idExist) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Postt not found. Id does not exist.",
        },
        { status: 404 }
      );
    }

    const result = await PromptSchemaModel.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Post deleted successfully.",
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post...", error);

    return NextResponse.json(
      {
        success: false,
        error_message: "Failed to delete post.",
      },
      { status: 500 }
    );
  }
};
