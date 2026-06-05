import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PortfolioDataService } from '../../shared/services/portfolio-data.service';
import { ScrollService } from '../../shared/services/scroll.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, OnDestroy {
  displayText = '';
  private _pi = 0;
  private _ci = 0;
  private _del = false;
  private _timer: any;

  constructor(
    public data:   PortfolioDataService,
    public scroll: ScrollService,
    @Inject(PLATFORM_ID) private pid: object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.pid)) {
      this._timer = setTimeout(() => this._type(), 1100);
    }
  }

  ngOnDestroy(): void { clearTimeout(this._timer); }

  private _type(): void {
    const phrases = this.data.typewriterPhrases;
    const ph = phrases[this._pi];
    if (!this._del) {
      this.displayText = ph.slice(0, this._ci + 1);
      this._ci++;
      if (this._ci === ph.length) {
        this._del = true;
        this._timer = setTimeout(() => this._type(), 2600);
        return;
      }
    } else {
      this.displayText = ph.slice(0, this._ci - 1);
      this._ci--;
      if (this._ci === 0) { this._del = false; this._pi = (this._pi + 1) % phrases.length; }
    }
    this._timer = setTimeout(() => this._type(), this._del ? 52 : 94);
  }
}
