import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAllImages, addImage, uploadImage } from "@/lib/supabase";

export async function GET() {
    try {
        const images = await getAllImages();
        return NextResponse.json(images);
    } catch (error) {
        console.error("Fetch images error:", error);
        return NextResponse.json(
            { error: "Failed to fetch images" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("image") as File;
        const caption = formData.get("caption") as string | null;

        if (!file) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        // Upload to Supabase Storage
        const imageUrl = await uploadImage(file);

        if (!imageUrl) {
            return NextResponse.json(
                { error: "Failed to upload image to storage" },
                { status: 500 }
            );
        }

        // Save to Database
        const newImage = await addImage(imageUrl, caption || "");

        if (!newImage) {
            return NextResponse.json(
                { error: "Failed to save image to database" },
                { status: 500 }
            );
        }

        return NextResponse.json(newImage);
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
