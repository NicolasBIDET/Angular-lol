import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  attemptCount: number = 0; // Nombre de tentatives échouées
  isLocked: boolean = false; // État de verrouillage
  lockEndTime: number = 0; // Timestamp de la fin du verrouillage

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.isLocked) {
      const remainingTime = Math.ceil((this.lockEndTime - Date.now()) / 1000);
      this.errorMessage = `Too many failed attempts. Please try again in ${remainingTime} seconds.`;
      return;
    }

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.authService.login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/']);
        this.resetAttempts(); // Réinitialiser les tentatives après une connexion réussie
      })
      .catch(error => {
        this.handleFailedAttempt(error);
      });
  }

  handleFailedAttempt(error: any) {
    this.errorMessage = error.message;
    this.attemptCount++;

    if (this.attemptCount >= 3) {
      this.isLocked = true;
      this.lockEndTime = Date.now() + 5 * 60 * 1000; // Verrouillage pendant 5 minutes
      this.errorMessage = 'Too many failed attempts. Please try again in 5 minutes.';
      setTimeout(() => this.unlock(), 5 * 60 * 1000); // Déverrouillage automatique après 5 minutes
    }
  }

  unlock() {
    this.isLocked = false;
    this.attemptCount = 0;
    this.lockEndTime = 0;
    this.errorMessage = '';
  }

  resetAttempts() {
    this.attemptCount = 0;
  }
}
