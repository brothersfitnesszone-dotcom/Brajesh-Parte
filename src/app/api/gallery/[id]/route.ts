
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateImageCaption, deleteImage } from "@/lib/supabase";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { caption } = await request.json();

        const success = await updateImageCaption(parseInt(id), caption);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: "Failed to update caption" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            { error: "Failed to update image" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const imageId = parseInt(id);

        // Supabase `deleteImage` handles both storage file and database record deletion
        const success = await deleteImage(imageId);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: "Failed to delete image" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete image" },
            { status: 500 }
        );
    }
}
