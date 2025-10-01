import {api} from '../utils/auth';



export interface AuthUser {
  id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

export const auth = {
  async login(username: string, password: string): Promise<AuthUser> {
    try {
      const { data, error } = await 
        .from('users')
        .select('id, username, name, last_name, email, role, is_active')
        .eq('username', username)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (error) throw new Error('Login failed');
      if (!data) throw new Error('User not found');

      // In a real app, you would verify the password hash here
      if (password !== 'admin') {
        throw new Error('Invalid password');
      }

      const user: AuthUser = {
        id: data.id,
        username: data.username,
        name: data.name,
        lastName: data.last_name,
        email: data.email,
        role: data.role,
        isActive: data.is_active
      };

      localStorage.setItem('auth_user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed');
    }
  },

  logout() {
    localStorage.removeItem('auth_user');
  },

  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.isActive;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === 'admin' : false;
  },

  requireAuth(requireAdmin = false): AuthUser {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Authentication required');
    if (!user.isActive) throw new Error('Account is inactive');
    if (requireAdmin && user.role !== 'admin') throw new Error('Admin access required');
    return user;
  }
};