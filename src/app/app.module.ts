import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ChampionService } from './service/champion.service';
import { FilterPipe } from './pipe/filter.pipe';
import { ChampionDetailComponent } from './champion-detail/champion-detail.component';
import { ChampionSummaryComponent } from './champion-summary/champion-summary.component';
import { ForumComponent } from './forum/forum.component';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    FilterPipe,
    ChampionDetailComponent,
    ChampionSummaryComponent,
    ForumComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase), // Utilisation de `initializeApp` de @angular/fire
    AngularFireAuthModule, // Module pour Auth
    AngularFirestoreModule, // Module pour Firestore
  ],
  providers: [

    ChampionService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }