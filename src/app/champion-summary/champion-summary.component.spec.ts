import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionSummaryComponent } from './champion-summary.component';

describe('ChampionSummaryComponent', () => {
  let component: ChampionSummaryComponent;
  let fixture: ComponentFixture<ChampionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
