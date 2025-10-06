import api from "./api";
import type { User} from "../types/type";

export const auth = {
  async login(username: string, password_hash: string): Promise<User> {
    try {
      const res = await api.post<User>("/users/login", {
        username,
        password_hash,
      });

      const user = res.data;

      localStorage.setItem("auth_user", JSON.stringify(user));
      return user;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Login failed");
    }
  },

  logout() {
    localStorage.removeItem("auth_user");
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("auth_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === "admin" : false;
  },

  requireAuth(requireAdmin = false): User {
    const user = this.getCurrentUser();
    if (!user) throw new Error("Authentication required");
    if (requireAdmin && user.role !== "admin")
      throw new Error("Admin access required");
    return user;
  },
};
