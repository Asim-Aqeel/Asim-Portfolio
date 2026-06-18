import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent }    from './components/navbar/navbar.component';
import { HeroComponent }      from './components/hero/hero.component';
import { AboutComponent }     from './components/about/about.component';
import { TechMarqueeComponent } from './components/tech-marquee/tech-marquee.component';
import { ServicesComponent }  from './components/services/services.component';
import { ProjectShowcaseComponent }  from './components/projects/project-showcase.component';
import { ContactComponent }   from './components/contact/contact.component';
import { FooterComponent }    from './components/footer/footer.component';
import { StarFieldComponent } from './components/star-field/star-field.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HeroComponent, AboutComponent,
            TechMarqueeComponent, ServicesComponent, ProjectShowcaseComponent, ContactComponent, FooterComponent, StarFieldComponent],
  template: `
    <star-field></star-field>
    <div id="cur" [style.left.px]="cx" [style.top.px]="cy"></div>
    <div id="curl" [style.left.px]="tx" [style.top.px]="ty"></div>
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
      <app-project-showcase></app-project-showcase>
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
    this._reveal();
  }

  private _reveal(): void {
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e,i) => { if(e.isIntersecting) setTimeout(()=>e.target.classList.add('vis'),i*65); });
    }, {threshold:.07});
    document.querySelectorAll('.rv').forEach(el => obs.observe(el));
  }
}
