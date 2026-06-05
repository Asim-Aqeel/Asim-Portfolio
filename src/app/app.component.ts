import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent }    from './components/navbar/navbar.component';
import { HeroComponent }      from './components/hero/hero.component';
import { AboutComponent }     from './components/about/about.component';
import { TechMarqueeComponent } from './components/tech-marquee/tech-marquee.component';
import { ServicesComponent }  from './components/services/services.component';
import { ProjectsComponent }  from './components/projects/projects.component';
import { ContactComponent }   from './components/contact/contact.component';
import { FooterComponent }    from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HeroComponent, AboutComponent,
            TechMarqueeComponent, ServicesComponent, ProjectsComponent, ContactComponent, FooterComponent],
  template: `
    <div id="cur" [style.left.px]="cx" [style.top.px]="cy"></div>
    <div id="curl" [style.left.px]="tx" [style.top.px]="ty"></div>
    <canvas id="bg-canvas"></canvas>
    <div class="orb orb1"></div>
    <div class="orb orb2"></div>
    <app-navbar></app-navbar>
    <a class="sticky-download-btn" href="assets/cv/software & web developer3.pdf" download>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download CV
    </a>
    <main>
      <app-hero></app-hero>
      <app-about></app-about>
      <app-tech-marquee></app-tech-marquee>
      <app-services></app-services>
      <app-projects></app-projects>
      <app-contact></app-contact>
    </main>
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  cx=0; cy=0; tx=0; ty=0;
  constructor(@Inject(PLATFORM_ID) private pid: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.pid)) return;
    document.addEventListener('mousemove', (e) => { this.cx=e.clientX; this.cy=e.clientY; });
    const trail = () => { this.tx+=(this.cx-this.tx)*.12; this.ty+=(this.cy-this.ty)*.12; requestAnimationFrame(trail); };
    trail();
    this._particles();
    this._reveal();
  }

  private _particles(): void {
    const cnv = document.getElementById('bg-canvas') as HTMLCanvasElement;
    if (!cnv) return;
    const ctx = cnv.getContext('2d')!;
    let W=0, H=0;
    const pts = Array.from({length:55}, () => ({
      x:Math.random()*3000, y:Math.random()*3000,
      vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22,
      r:Math.random()*1.3+.3, o:Math.random()*.28+.05
    }));
    const resize = () => { W=cnv.width=innerWidth; H=cnv.height=innerHeight; };
    resize(); window.addEventListener('resize', resize, {passive:true});
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      const dark = document.documentElement.dataset['theme'] !== 'light';
      const rgb  = dark ? '0,245,196' : '37,99,235';
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${rgb},${p.o})`; ctx.fill();
      });
      pts.forEach((p,i) => pts.slice(i+1).forEach(q => {
        const d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<105){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(${rgb},${.028*(1-d/105)})`;ctx.lineWidth=.5;ctx.stroke();}
      }));
      requestAnimationFrame(draw);
    };
    draw();
  }

  private _reveal(): void {
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e,i) => { if(e.isIntersecting) setTimeout(()=>e.target.classList.add('vis'),i*65); });
    }, {threshold:.07});
    document.querySelectorAll('.rv').forEach(el => obs.observe(el));
  }
}
