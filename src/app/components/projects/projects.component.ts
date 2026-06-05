import { Component, OnInit, AfterViewInit, OnDestroy,
         ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PortfolioDataService } from '../../shared/services/portfolio-data.service';
import { Project } from '../../models/portfolio.models';

interface CardState { op: number; ty: number; sc: number; blur: number; zi: number; }

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('spacer') spacerRef!: ElementRef<HTMLElement>;

  projects: Project[] = [];
  states: CardState[] = [];
  currentIdx = 0;
  private _h = () => this._update();

  constructor(public data: PortfolioDataService,
              @Inject(PLATFORM_ID) private pid: object) {}

  ngOnInit(): void {
    this.projects = this.data.projects;
    this.states   = this.projects.map(() => ({ op:0, ty:60, sc:0.93, blur:8, zi:1 }));
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.pid)) return;
    this.spacerRef.nativeElement.style.height = `${this.projects.length * 100}vh`;
    window.addEventListener('scroll', this._h, { passive: true });
    this._update();
  }

  ngOnDestroy(): void { window.removeEventListener('scroll', this._h); }

  private _c = (v:number,lo:number,hi:number) => Math.min(Math.max(v,lo),hi);
  private _m = (a:number,b:number,t:number) => a+(b-a)*t;
  private _eO = (t:number) => 1-Math.pow(1-t,3);
  private _eI = (t:number) => t*t*t;

  private _update(): void {
    const el = this.spacerRef?.nativeElement;
    if (!el) return;
    const rawIdx = Math.max(0, -el.getBoundingClientRect().top) / window.innerHeight;
    this.currentIdx = this._c(Math.round(rawIdx), 0, this.projects.length-1);

    this.projects.forEach((_, i) => {
      const d = rawIdx - i;
      let op:number, ty:number, sc:number, blur:number, zi:number;
      if (d < -0.08) {
        op=0; ty=60; sc=0.93; blur=8; zi=1;
      } else if (d < 0) {
        const e = this._eO(this._c((d+0.08)/0.08,0,1));
        op=this._m(0,1,e); ty=this._m(60,0,e); sc=this._m(0.93,1,e); blur=this._m(8,0,e); zi=10;
      } else if (d < 1) {
        op=1; ty=0; sc=1; blur=0; zi=10;
      } else if (d < 1.8) {
        const e = this._eI(this._c((d-1)/0.8,0,1));
        op=this._m(1,0.1,e); ty=this._m(0,-26,e); sc=this._m(1,0.89,e); blur=this._m(0,5,e); zi=9;
      } else {
        const age=d-1.8;
        op=Math.max(0,0.06-age*.06); ty=-26-age*10;
        sc=Math.max(0.83,0.89-age*.02); blur=5; zi=Math.max(1,8-Math.floor(d));
      }
      this.states[i] = { op, ty, sc, blur, zi };
    });
  }

  cardTransform(s: CardState): string {
    return `translateY(${s.ty.toFixed(1)}px) scale(${s.sc.toFixed(4)})`;
  }
  cardFilter(s: CardState): string {
    return s.blur > 0.05 ? `blur(${s.blur.toFixed(1)}px)` : 'none';
  }
  scrollToProject(i: number): void {
    const el = this.spacerRef?.nativeElement;
    if (!el) return;
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top + i*window.innerHeight, behavior:'smooth' });
  }
}
