import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChampionService {
  private apiUrl = 'https://ddragon.leagueoflegends.com/cdn/14.23.1/data/en_US/champion.json';

  constructor(private http: HttpClient) {}

  getChampions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getChampionDetails(championId: string): Observable<any> {
    const url = `https://ddragon.leagueoflegends.com/cdn/14.23.1/data/en_US/champion/${championId}.json`;
    return this.http.get<any>(url);
  }
}