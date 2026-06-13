import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecode, JwtPayload } from "jwt-decode"

export const privateRoutes = ["/home", "/profile", "/pod-heads", "/editors"]
export const publicRoutes = ["/"]

const SESSION_COOKIE_NAME = "session"

const isTokenValid = (token?: string): boolean => {
  if (!token) return false

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const currentTime = Math.floor(Date.now() / 1000)

    if (decoded.exp && decoded.exp < currentTime) {
      console.warn("Session expired.")
      return false
    }

    return true
  } catch (error) {
    console.error("Invalid session token:", error)
    return false
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const hasValidSession = isTokenValid(sessionCookie)

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  if (isPrivateRoute && !hasValidSession) {
    console.log("Unauthenticated → Redirecting to /")
    return NextResponse.redirect(new URL("/", request.nextUrl))
  }

  if (isPublicRoute && hasValidSession) {
    console.log("Already authenticated → Redirecting to /home")
    return NextResponse.redirect(new URL("/home", request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
