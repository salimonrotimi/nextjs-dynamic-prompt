// This "route.js" file is for the "prompt" folder. The path is /api/prompt
import connectToDB from "@utils/dbconnection";
import PromptSchemaModel from "@models/prompt-schema";
import LikeSchemaModel from "@models/like-schema";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

// NOTE: "res" and "req.body" are not available in Next.js

// GET
export const DELETE = async(request, { params }) => {
    // the "params" argument is an object which has the "id" in the URL. The value is obtained with "params.id"
    const { id } = await params; // "id" is the folder name in your file i.e. [id]
    const session = await getServerSession(authOptions);

    if (request.method !== "DELETE") {
        return NextResponse.json({
            success: false,
            error_message: "Method not allowed. Accept only DELETE request.",
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

        // confirm that prompt "id" exist in the PromptSchemaModel before using it to delete likes
        const idExist = await PromptSchemaModel.findById(id);

        if (!idExist) {
            return NextResponse.json({
                success: false,
                error_message: "Post not found. Id does not exist.",
            }, { status: 404 });
        }

        const deleteLike = await LikeSchemaModel.findOneAndDelete({
            postId: id,
            likedBy: session.user.id,
        });

        if (!deleteLike) {
            return NextResponse.json({
                success: false,
                error_message: "Could not unlike post.",
            }, { status: 400 });
        }

        // Get the total likes after removing one like from post
        const totalLikes = await LikeSchemaModel.countDocuments({ postId: id });

        return NextResponse.json({
            success: true,
            message: "Post unliked successfully.",
            totalLikes,
            isLikedByUser: false,
        }, { status: 200 });
    } catch (error) {
        console.error("Error unliking post...", error);

        return NextResponse.json({
            success: false,
            error_message: "Failed to unlike post.",
        }, { status: 500 });
    }
};