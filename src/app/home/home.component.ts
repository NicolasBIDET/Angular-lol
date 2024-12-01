import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ChampionService } from '../service/champion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any = null;
  champions: any[] = [];
  searchTerm: string = '';
  selectedType: string = '';
  selectedPartype: string = '';
  

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private championService: ChampionService
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadChampions();
      } else {
        this.router.navigate(['/login']); // Redirige si non authentifié
      }
    });
  }

  loadChampions() {
    this.championService.getChampions().subscribe(data => {
      this.champions = Object.values(data.data);
    });
  }

  getChampionTypes(): string[] {
    const types = new Set<string>();
    this.champions.forEach(champion => {
      champion.tags.forEach((tag: string) => types.add(tag));
    });
    return Array.from(types);
  }

  filteredChampions() {
    return this.champions.filter(champion => {
      const matchesSearchTerm = champion.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType ? champion.tags.includes(this.selectedType) : true;
      const matchesPartype = this.selectedPartype === 'mana' ? champion.partype.toLowerCase().includes('mana') : 
                             this.selectedPartype === 'no-mana' ? !champion.partype.toLowerCase().includes('mana') : true;
      return matchesSearchTerm && matchesType && matchesPartype;
    });
  }

  viewChampionDetails(championId: string) {
    this.router.navigate(['/champion', championId]);
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']); // Redirige après déconnexion
    });
  }
}