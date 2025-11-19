import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const ADMIN_USERNAME = "aminteriorsadmin"
const ADMIN_PASSWORD = "12345"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a simple session token
      const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString("base64")
      
      // Set cookie with session token
      const cookieStore = await cookies()
      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return NextResponse.json({ success: true, message: "Login successful" })
    }

    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
}
