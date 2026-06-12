import dayjs from "dayjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecode, JwtPayload } from "jwt-decode"

export const privateRoutes = ["/", "/profile", "/pod-heads", "/editors"]
export const publicRoutes = ["/login"]

const isTokenValid = (token?: string): boolean => {
  if (!token) return false

  try {
    const decodedToken = jwtDecode<JwtPayload>(token)
    const currentTime = dayjs().unix()

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.warn("Token expired.")
      return false
    }

    return true
  } catch (error) {
    console.error("Invalid token:", error)
    return false
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get("access_token")?.value
  const hasValidAccessToken = isTokenValid(accessToken)

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  if (isPrivateRoute && !hasValidAccessToken) {
    console.log("Unauthenticated > Redirecting to /login")
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  if (isPublicRoute && hasValidAccessToken) {
    console.log("Already authenticated > Redirecting to /dashboard")
    return NextResponse.redirect(new URL("/", request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
