
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAllSettings, updateSettings } from "@/lib/supabase";

export async function GET() {
    try {
        const settings = await getAllSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Fetch settings error:", error);
        return NextResponse.json(
            { error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const settings = await request.json();
        const success = await updateSettings(settings);

        if (success) {
            // Return updated settings
            const newSettings = await getAllSettings();
            return NextResponse.json(newSettings);
        } else {
            return NextResponse.json(
                { error: "Failed to save settings" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Save settings error:", error);
        return NextResponse.json(
            { error: "Failed to save settings" },
            { status: 500 }
        );
    }
}
