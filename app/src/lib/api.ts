// Base URL for the Express API. Set VITE_API_BASE_URL at build time (see app/.env.example).
// Falls back to the local backend in development and to same-origin ("") in production builds.
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:3001" : "")).replace(/\/+$/, "")

export class ApiError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("auth_token")
  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as { error?: string }
    throw new ApiError(error.error || "Something went wrong", response.status)
  }

  return response.json()
}

export interface UserProfileResponse {
  user: {
    id: string
    username: string
    name: string | null
  }
}

export interface UpdateProfileData {
  username: string
  name?: string | null
  currentPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  success: boolean
  message: string
}

export async function getProfile(): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>('/api/user/profile')
}

export async function updateProfile(data: UpdateProfileData): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function changePassword(data: ChangePasswordData): Promise<ChangePasswordResponse> {
  return apiRequest<ChangePasswordResponse>('/api/user/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

