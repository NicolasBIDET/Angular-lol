import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChampionService } from '../service/champion.service';

@Component({
  selector: 'app-champion-detail',
  templateUrl: './champion-detail.component.html',
  styleUrls: ['./champion-detail.component.css']
})
export class ChampionDetailComponent implements OnInit {
  champion: any;
  activeDescriptionIndex: number | string | null = null;
  currentSlide = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private championService: ChampionService
  ) {}

  ngOnInit() {
    const championId = this.route.snapshot.paramMap.get('id');
    if (championId) {
      this.championService.getChampionDetails(championId).subscribe(data => {
        this.champion = data.data[championId];
      });
    } else {
      console.error('Champion ID is null');
    }
  }

  toggleDescription(index: number | string) {
    this.activeDescriptionIndex = this.activeDescriptionIndex === index ? null : index;
  }

  nextSlide() {
    if (this.champion) {
      this.currentSlide = (this.currentSlide + 1) % this.champion.skins.length;
    }
  }

  prevSlide() {
    if (this.champion) {
      this.currentSlide = (this.currentSlide - 1 + this.champion.skins.length) % this.champion.skins.length;
    }
  }
  
  forum(championId: string) {
    this.router.navigate(['/forum', championId]);
  }
}