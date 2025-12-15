import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'current_user';

export interface User {
  email: string;
  password: string; // pro školní demo (v praxi by se hashovalo a řešil backend)
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users: User[] = [];
  private loaded = false;

  private async loadUsers(): Promise<void> {
    if (this.loaded) return;
    const { value } = await Preferences.get({ key: USERS_KEY });
    this.users = value ? JSON.parse(value) : [];
    this.loaded = true;
  }

  private async saveUsers(): Promise<void> {
    await Preferences.set({
      key: USERS_KEY,
      value: JSON.stringify(this.users),
    });
  }

  async register(email: string, password: string): Promise<void> {
    await this.loadUsers();

    const e = email.trim().toLowerCase();
    if (!e || !password) throw new Error('Vyplň email a heslo.');

    const exists = this.users.some(u => u.email === e);
    if (exists) throw new Error('Uživatel s tímto emailem už existuje.');

    this.users.push({ email: e, password });
    await this.saveUsers();

    // auto-login po registraci
    await Preferences.set({ key: CURRENT_USER_KEY, value: e });
  }

  async login(email: string, password: string): Promise<void> {
    await this.loadUsers();

    const e = email.trim().toLowerCase();
    const user = this.users.find(u => u.email === e && u.password === password);
    if (!user) throw new Error('Špatný email nebo heslo.');

    await Preferences.set({ key: CURRENT_USER_KEY, value: e });
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: CURRENT_USER_KEY });
  }

  async getCurrentUserEmail(): Promise<string | null> {
    const { value } = await Preferences.get({ key: CURRENT_USER_KEY });
    return value ?? null;
  }

  async isLoggedIn(): Promise<boolean> {
    const email = await this.getCurrentUserEmail();
    return !!email;
  }
}
