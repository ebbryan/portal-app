"use server"

import { cookies } from "next/headers"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserById, getUserByUsername } from "./users.actioon"
import { getRoleById } from "./roles.action"
import { adminAuth } from "@/lib/firebase.admin"

const SESSION_COOKIE_NAME = "session"
const SESSION_EXPIRY_MS = 60 * 60 * 24 * 5 * 1000

export type AuthResult = {
  success: boolean
  message: string
  error?: string
}

// Login
export async function login(
  username: string,
  password: string
): Promise<AuthResult> {
  try {
    const user = await getUserByUsername(username)

    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      password
    )
    const idToken = await userCredential.user.getIdToken()

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY_MS,
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_MS / 1000,
      path: "/",
    })

    return { success: true, message: "Login successfully" }
  } catch (error: any) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "Login failed",
      error: mapFirebaseError(error.code),
    }
  }
}

// Logout
export async function logout(): Promise<AuthResult> {
  try {
    await signOut(auth)

    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)

    return { success: true, message: "Login successfully" }
  } catch (error: any) {
    console.error("Logout error:", error)
    return {
      success: false,
      error,
      message: "Failed to logout. Please try again.",
    }
  }
}

export async function verifySession(): Promise<{
  valid: boolean
  uid?: string
  email?: string
}> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!sessionCookie) return { valid: false }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return { valid: true, uid: decoded.uid, email: decoded.email }
  } catch {
    return { valid: false }
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")?.value
    if (!sessionCookie) return null

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    const getUserByIdResponse = await getUserById(decoded.sub)
    if (!getUserByIdResponse) return null

    const getRoleByIdResponse = await getRoleById(getUserByIdResponse.role_id)

    if (!getRoleByIdResponse) return null

    return {
      ...getUserByIdResponse,
      createdAt: JSON.stringify(getUserByIdResponse.createdAt),
      uid: decoded.uid,
      role_id: JSON.stringify(getRoleByIdResponse),
    }
  } catch {
    return null
  }
}

// Map Firebase error codes to readable messages
function mapFirebaseError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password."
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later."
    case "auth/user-disabled":
      return "This account has been disabled."
    default:
      return "Something went wrong. Please try again."
  }
}
