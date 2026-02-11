import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private role: string | null = null;

  constructor() {
    // טוען role מ־localStorage אם קיים
    const storedRole = localStorage.getItem('role');
    this.role = storedRole ? storedRole : null;
  }

  setRole(role: string) {
    this.role = role;
    localStorage.setItem('role', role);
  }

  getRole(): string | null {
    return this.role;
  }

  logout() {
    this.role = null;
    localStorage.removeItem('role');
  }
}
