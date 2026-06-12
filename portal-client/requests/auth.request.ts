"use server"
import { logout, readMe, readRole, readUsers, withToken } from "@directus/sdk"
import { directusClient } from "../lib/directus"

import { TAuthToken } from "../types/Auth.type"
import { destructCookies, setCookie } from "../helpers/SetCookie"
import { TUser } from "@/types/User.type"
import { cookieTokenGrabber } from "@/helpers/CookieGrabber"
import { decodeToken } from "@/helpers/JwtDecoder"
import { cookies } from "next/headers"

const ROLE_NAME_COOKIE = "role_name"

const setRoleNameCookie = async (roleName: string) => {
  const cookieStore = await cookies()
  cookieStore.set(ROLE_NAME_COOKIE, roleName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export async function login(username: string, password: string) {
  try {
    // 1. Look up the user by username
    const user = (await directusClient.request(
      readUsers({
        filter: { username: { _eq: username } },
      })
    )) as TUser[]

    if (user.length === 0) {
      return { success: false, message: "User not found" }
    }

    const userEmail = user[0].email

    // 2. Authenticate and get tokens
    const response = (await directusClient.login({
      email: userEmail,
      password,
    })) as TAuthToken

    if (!response.access_token) {
      return { success: false, message: "Invalid credentials" }
    }

    // 3. Decode the access token to extract the role ID
    //    Directus embeds the role UUID under the `role` claim
    const payload = await decodeToken<{ role?: string }>(response.access_token)
    const roleId = payload.role

    // 4. Fetch the role name from directus_roles using the role ID
    let roleName = "unknown"
    if (roleId) {
      try {
        const role = await directusClient.request(readRole(roleId))
        roleName = role?.name ?? "unknown"
      } catch {
        // Non-fatal — session still works, role name just won't be available
        console.warn(`Could not fetch role name for role ID: ${roleId}`)
      }
    }

    // 5. Store tokens + role name in cookies
    setCookie(response.access_token, response.refresh_token)
    await setRoleNameCookie(roleName)

    return { success: true, data: response }
  } catch (error) {
    return { success: false, message: "Login failed" }
  }
}

export const logoutUser = async () => {
  const { refreshToken } = await cookieTokenGrabber()
  if (!refreshToken) {
    destructCookies()
    return
  }

  try {
    await directusClient.request(
      logout({ refresh_token: refreshToken, mode: "json" })
    )
    return { message: "Logout successful", success: true }
  } catch (error) {
    console.error("Logout request failed:", error) // <-- will tell you the real reason
    // Still destroy cookies so the user is logged out locally
    // even if the server request fails
  } finally {
    destructCookies()
  }
}

export async function readCurrentUser() {
  try {
    const { accessToken } = await cookieTokenGrabber()
    const response = (await directusClient.request(
      withToken(accessToken, readMe())
    )) as TUser
    return { success: true, data: response }
  } catch (error) {
    return { success: false, message: "Failed to fetch user data" }
  }
}
