import { logout, readMe, readUsers, withToken } from "@directus/sdk"
import { directusClient } from "../lib/directus"

import { TAuthToken } from "../types/Auth.type"
import { destructCookies, setCookie } from "../helpers/SetCookie"
import { TUser } from "@/types/User.type"
import { cookieTokenGrabber } from "@/helpers/CookieGrabber"

export async function login(username: string, password: string) {
  try {
    const user = (await directusClient.request(
      readUsers({
        filter: { username: { _eq: username } },
      })
    )) as TUser[]

    if (user.length === 0) {
      return { success: false, message: "User not found" }
    }

    const userEmail = user[0].email

    const response = (await directusClient.login({
      email: userEmail,
      password,
    })) as TAuthToken

    if (!response.access_token) {
      return { success: false, message: "Invalid credentials" }
    }

    setCookie(response.access_token, response.refresh_token)
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
