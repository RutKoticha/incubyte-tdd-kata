/**
 * Represents a user within the Car Dealership Inventory System.
 */
export interface User {
  /** The unique identifier of the user. */
  id: string;
  /** The full name of the user. */
  name: string;
  /** The email address of the user, used for credentials. */
  email: string;
  /** The role of the user, determining administrative privileges. */
  role: 'admin' | 'user';
}

/**
 * Represents the response returned by the authentication endpoints.
 */
export interface AuthResponse {
  /** The JWT access token. */
  token: string;
  /** The authenticated user profile details. */
  user: User;
}
