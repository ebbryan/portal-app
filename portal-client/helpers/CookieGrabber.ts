"use server"

import { cookies } from "next/headers"

export const cookieTokenGrabber = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access_token")?.value as string
  const refreshToken = cookieStore.get("refresh_token")?.value as string
  if (!accessToken || !refreshToken) throw new Error("No token found")

  return { refreshToken, accessToken }
}
