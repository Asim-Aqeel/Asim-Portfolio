import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScrollService implements OnDestroy {
  private readonly SECTION_IDS = ['hero','about','services','projects','experience','cv','contact'];
  activeSection$ = new BehaviorSubject<string>('hero');
  private _listener = () => this._onScroll();

  constructor(private zone: NgZone) {
    zone.runOutsideAngular(() =>
      window.addEventListener('scroll', this._listener, { passive: true }));
  }

  ngOnDestroy() { window.removeEventListener('scroll', this._listener); }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  private _onScroll(): void {
    for (const id of this.SECTION_IDS) {
      const el = document.getElementById(id) ?? document.getElementById('proj-header');
      if (!el) continue;
      const { top, bottom } = el.getBoundingClientRect();
      if (top <= 90 && bottom >= 90) {
        const cur = this.activeSection$.getValue();
        if (cur !== id) this.zone.run(() => this.activeSection$.next(id));
        break;
      }
    }
  }
}
