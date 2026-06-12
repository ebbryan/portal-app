import { readUsers } from "@directus/sdk"
import { directusClient } from "../lib/directus"
import { User } from "../types/User.type"
import { TAuthToken } from "../types/Auth.type"
import { setCookie } from "../helpers/SetCookie"

export async function login(username: string, password: string) {
  try {
    const user = (await directusClient.request(
      readUsers({
        filter: { username: { _eq: username } },
      })
    )) as User[]

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
  //   const result = await directusClient.login({ email, password })
}
