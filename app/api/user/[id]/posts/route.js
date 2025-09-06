// This "route.js" file is for the "user" folder. The path is /api/user/[id]/posts
import connectToDB from "@utils/dbconnection";
import PromptSchemaModel from "@models/prompt-schema";
import { NextResponse } from "next/server";
import { sanitizeHTML } from "@utils/input-sanitizer";

// NOTE: "res" and "req.body" are not available in Next.js

export const GET = async(request, { params }) => {
    // the "params" argument is an object which has the "id" in the URL. The value is obtained with "params.id"
    const { id } = await params;

    if (request.method !== "GET") {
        return NextResponse.json({
            success: false,
            error_message: "Method not allowed. Accept only GET request.",
        }, { status: 405 });
    }

    try {
        await connectToDB();

        const result = await PromptSchemaModel.find({ creator: id })
            .select("-createdAt -updatedAt")
            .populate({
                path: "creator",
                select: "username email image",
                model: "User",
            }); // .populate("creator", "username email image");   // This also works. "model" is optional as above

        // .populate() uses the users ObjectId stored in "creator" to fill the creator field with the user details

        if (!result) {
            return NextResponse.json({
                success: false,
                error_message: "Could not retrieve prompt",
            }, { status: 400 });
        }

        // sanitize the data retrieved from the database
        result.forEach((item) => {
            item.prompt = sanitizeHTML(item.prompt);
            item.tag = sanitizeHTML(item.tag);
        });

        return NextResponse.json({
            success: true,
            message: "Prompt retrieved successfully.",
            result,
        }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving prompt...", error);

        return NextResponse.json({
            success: false,
            error_message: "Failed to retrieve prompt.",
        }, { status: 500 });
    }
};