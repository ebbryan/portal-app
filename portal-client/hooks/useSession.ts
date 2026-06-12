"use client"

import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Raw Directus JWT claims */
export interface DirectusJwtPayload {
  id?: string
  role?: string
  app_access?: boolean
  admin_access?: boolean
  iat?: number
  exp?: number
  iss?: string
  [key: string]: unknown
}

/** Enriched client-side session — mirrors the server Session type */
export interface Session extends DirectusJwtPayload {
  role_name: string
}

export interface UseSessionReturn {
  session: Session | null
  isLoading: boolean
  isExpired: boolean
  error: string | null
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Reads access_token + role_name from document.cookie and returns
 * a unified Session object with the resolved role name.
 *
 * ⚠️  Requires cookies to NOT be HttpOnly.
 *     If your tokens are HttpOnly, use getServerSession() and pass
 *     the session down as a prop or via context.
 *
 * @example
 * const { session, isLoading, isExpired } = useSession()
 * if (session) {
 *   console.log(session.id)        // user UUID
 *   console.log(session.role)      // role UUID
 *   console.log(session.role_name) // "Administrator", "Editor", etc.
 * }
 */
export const useSession = (): UseSessionReturn => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const token = getCookieValue("access_token")
      console.log("🚀 ~ useSession ~ token:", token)

      if (!token) {
        setError("No access token found in cookies")
        return
      }

      const payload = jwtDecode<DirectusJwtPayload>(token)
      const expired = payload.exp ? Date.now() >= payload.exp * 1000 : false

      // Pick up the role name stored at login time
      const role_name = getCookieValue("role_name") ?? "unknown"
      console.log("🚀 ~ useSession ~ role_name:", role_name)

      setSession({ ...payload, role_name })
      setIsExpired(expired)
    } catch {
      setError("Failed to decode access token")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { session, isLoading, isExpired, error }
}

// ---------------------------------------------------------------------------
// Internal utility
// ---------------------------------------------------------------------------

const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") return null

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))

  return match ? decodeURIComponent(match.split("=")[1]) : null
}
