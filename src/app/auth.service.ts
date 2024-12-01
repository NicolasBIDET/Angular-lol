import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Assurez-vous d'importer map pour transformer les observables

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  // Retourne un Observable de l'utilisateur connecté
  get user(): Observable<any> {
    return this.afAuth.authState;
  }

  // Méthode pour se connecter avec email et mot de passe
  login(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        // Redirige vers /home après une connexion réussie
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        throw error;
      });
  }

  // Méthode pour s'enregistrer avec email et mot de passe
  register(email: string, password: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        // Une fois inscrit, redirige vers /login
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        throw error;
      });
  }

  // Méthode pour se déconnecter
  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user) // Renvoie vrai si l'utilisateur est authentifié
    );
  }
}
