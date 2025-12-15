import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email = '';
  password = '';
  password2 = '';
  error: string | null = null;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async register() {
    this.error = null;

    if (this.password !== this.password2) {
      this.error = 'Hesla se neshodují.';
      return;
    }

    this.loading = true;
    try {
      await this.auth.register(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (e: any) {
      this.error = e?.message ?? 'Nepodařilo se zaregistrovat.';
    } finally {
      this.loading = false;
    }
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
