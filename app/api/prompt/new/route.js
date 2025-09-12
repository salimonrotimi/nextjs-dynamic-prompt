// This "route.js" file is for the "new" folder. The path is /api/prompt/new

import connectToDB from "@utils/dbconnection";
import PromptSchemaModel from "@models/prompt-schema";
import { NextResponse } from "@node_modules/next/server"; // for sending response back to client
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

// NOTE: "res" and "req.body" are not available in Next.js
export const POST = async(request) => {
    const session = await getServerSession(authOptions);

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
        // first get the "content-type" in order to know how to handle the client data
        const contentType = request.headers.get("content-type");
        let clientData;

        if (contentType.includes("application/json")) {
            clientData = await request.json();
        } else if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            clientData = {
                userId: formData.get("userId"),
                prompt: formData.get("prompt"),
                tag: formData.get("tag"),
            };
        } else {
            // for content type "application/x-www-form-urlencoded"
            const formData = await request.formData();
            clientData = Object.fromEntries(formData.entries());
        }

        const { userId, prompt, tag } = clientData; // destructure the client data

        if (!userId || !prompt || !tag) {
            return NextResponse.json({
                success: false,
                error_message: "Bad Request. Prompt and tag cannot be empty.",
            }, { status: 400 });
        }

        const result = await PromptSchemaModel.create({
            creator: userId,
            prompt,
            tag,
        });

        if (!result) {
            return NextResponse.json({
                success: false,
                error_message: "Could not create post",
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Post created successfully.",
            result,
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating post...", error);

        return NextResponse.json({
            success: false,
            error_message: "Failed to create prompt.",
        }, { status: 500 });
    }
};