import { NextResponse } from "next/server";
import { authenticateUser, setAuthCookie } from "@/lib/auth";
import { initializeDefaultAdmin, initializeDefaultSettings } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        // Initialize defaults on first request
        await initializeDefaultAdmin();
        await initializeDefaultSettings();

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await authenticateUser(email, password);

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        await setAuthCookie(user.userId, user.email);

        return NextResponse.json({
            success: true,
            user: { email: user.email },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}
