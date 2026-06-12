export type TUser = {
  first_name: string
  username: string
  last_name: string
  email: string
  role: string
  status: "active" | "inactive"
  id: string
  last_access: Date
}
