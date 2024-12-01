import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-champion-summary',
  templateUrl: './champion-summary.component.html',
  styleUrls: ['./champion-summary.component.css']
})

export class ChampionSummaryComponent {
  @Input() champion: any; // Données du champion
}

