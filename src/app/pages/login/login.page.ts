import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  /** ✅ pokaždé, když se stránka zobrazí (např. po Odhlásit), vyčisti pole */
  ionViewWillEnter() {
    this.email = '';
    this.password = '';
    this.error = null;
    this.loading = false;
  }

  async login() {
    this.error = null;
    this.loading = true;
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (e: any) {
      this.error = e?.message ?? 'Nepodařilo se přihlásit.';
    } finally {
      this.loading = false;
    }
  }

  goRegister() {
    this.router.navigate(['/register'], { replaceUrl: true });
  }
}
