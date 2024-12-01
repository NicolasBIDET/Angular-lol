import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ChampionService } from '../service/champion.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any = null;
  champions: any[] = [];
  filterForm: FormGroup;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private championService: ChampionService,
    private fb: FormBuilder // FormBuilder pour simplifier la création du FormGroup
  ) {
    // Initialiser le FormGroup
    this.filterForm = this.fb.group({
      searchTerm: [''],
      type: [''],
      selectedPartype: ['']
    });
  }

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
    const searchTerm = this.filterForm.get('searchTerm')?.value.toLowerCase() || '';
    const selectedType = this.filterForm.get('type')?.value || '';
    const selectedPartype = this.filterForm.get('selectedPartype')?.value || '';

    return this.champions.filter(champion => {
      const matchesSearchTerm = champion.name.toLowerCase().includes(searchTerm);
      const matchesType = selectedType ? champion.tags.includes(selectedType) : true;
      const matchesPartype = selectedPartype === 'mana' ? champion.partype.toLowerCase().includes('mana') :
                             selectedPartype === 'no-mana' ? !champion.partype.toLowerCase().includes('mana') : true;
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
