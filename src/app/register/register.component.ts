import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; // Champ pour confirmer le mot de passe
  errorMessage: string = '';
  passwordError: string = ''; // Message d'erreur pour la validation du mot de passe

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  validatePassword() {
    // Vérifie que le mot de passe contient au moins 8 caractères, une majuscule et un chiffre
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.passwordError = 'Password must be at least 8 characters long, contain one uppercase letter, and one number.';
    } else if (this.password !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match.';
    } else {
      this.passwordError = ''; // Pas d'erreur
    }
  }

  register() {
    if (this.passwordError) {
      return; // Ne pas enregistrer si des erreurs de validation persistent
    }

    this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.router.navigate(['/']); // Redirige après l'inscription
      })
      .catch(error => {
        this.errorMessage = error.message; // Affiche un message d'erreur
      });
  }
}
