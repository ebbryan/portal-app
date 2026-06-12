"use server"

import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"
import { cookieTokenGrabber } from "./CookieGrabber"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Raw Directus JWT claims */
export interface DirectusJwtPayload {
  id?: string // user UUID
  role?: string // role UUID
  app_access?: boolean
  admin_access?: boolean
  iat?: number
  exp?: number
  iss?: string
  [key: string]: unknown
}

/** Enriched session object returned by getServerSession() */
export interface Session extends DirectusJwtPayload {
  role_name: string // resolved from the role_name cookie set at login
}

// ---------------------------------------------------------------------------
// Core utilities
// ---------------------------------------------------------------------------

/**
 * Decodes a raw JWT string into a typed payload.
 * Does NOT verify the signature — use only after the token
 * has already been validated (e.g. via Directus middleware or refresh logic).
 */
export const decodeToken = async <
  T extends DirectusJwtPayload = DirectusJwtPayload,
>(
  token: string
): Promise<T> => {
  try {
    return jwtDecode<T>(token)
  } catch {
    throw new Error("Invalid or malformed JWT")
  }
}

/**
 * Returns true if the decoded payload's exp claim is in the past.
 */
export const isTokenExpired = async (
  payload: DirectusJwtPayload
): Promise<boolean> => {
  if (!payload.exp) return false
  return Date.now() >= payload.exp * 1000
}

// ---------------------------------------------------------------------------
// Server session
// ---------------------------------------------------------------------------

/**
 * Grabs the access_token + role_name cookies, decodes the JWT,
 * and returns a unified Session object with the resolved role name.
 *
 * Throws if:
 * - access_token or refresh_token cookies are missing
 * - the token is malformed
 * - the token is expired
 *
 * @example
 * const session = await getServerSession()
 * console.log(session.id)        // user UUID
 * console.log(session.role)      // role UUID
 * console.log(session.role_name) // "Administrator", "Editor", etc.
 */
export const getServerSession = async (): Promise<Session> => {
  const { accessToken } = await cookieTokenGrabber()
  const payload = await decodeToken(accessToken)
  const expired = await isTokenExpired(payload)

  if (expired) {
    throw new Error("Access token has expired")
  }

  // Read the role_name cookie stored at login time
  const cookieStore = await cookies()
  const role_name = cookieStore.get("role_name")?.value ?? "unknown"

  return { ...payload, role_name }
}
